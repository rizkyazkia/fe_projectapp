import {
  Document,
  Image,
  PDFViewer,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import { getCurrrentDate } from "../../../../lib/utility";
import { styles } from "./Style";
import { useAuth } from "../../../../hooks/auth/useAuth";
import { getUserById } from "../../../../lib/admin/users/usersAPI";
import useSWR from "swr";
import { token } from "../../../../lib/auth/authAPI";
import { jwtDecode } from "jwt-decode";

export function renderTiptapToPdf(jsonContent) {
  if (!jsonContent || !jsonContent.content) return null;

  return jsonContent.content.map((node, index) => renderNode(node, index));
}

function renderNode(node, index, ordered = false, number = 1) {
  switch (node.type) {
    case "paragraph":
      return (
        <Text key={index} style={styles.copTextContent}>
          {node.content?.map((cont, idx) => renderTextNode(cont, idx))}
        </Text>
      );

    case "heading":
      const headingLevel = node.attrs?.level || 1;
      const headingSizes = {
        1: 16,
        2: 15,
        3: 14,
        4: 12,
        5: 10,
        6: 8,
      };

      return (
        <Text
          key={index}
          style={{
            fontSize: headingSizes[headingLevel],
            fontWeight: "bold",
            marginBottom: 8,
          }}
        >
          {node.content?.map((cont) => cont.text).join(" ")}
        </Text>
      );

    case "bulletList":
      return (
        <View key={index} style={{ paddingLeft: 12, marginBottom: 8 }}>
          {node.content?.map((item, i) => renderNode(item, i, false))}
        </View>
      );

    case "orderedList":
      return (
        <View key={index} style={{ paddingLeft: 12, marginBottom: 8 }}>
          {node.content?.map((item, i) => renderNode(item, i, true, i + 1))}
        </View>
      );

    case "listItem":
      return (
        <View
          key={index}
          style={{ flexDirection: "row", marginBottom: 4, fontSize: 12 }}
        >
          <Text style={{ marginRight: 4, fontSize: 12 }}>
            {ordered ? `${number}.` : `•`}
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              flex: 1,
            }}
          >
            {node.content?.map((child, idx) => renderNode(child, idx))}
          </View>
        </View>
      );

    default:
      return null;
  }
}

function renderTextNode(node, index) {
  if (node.type !== "text") return null;

  const isBold = node.marks?.some((m) => m.type === "bold");
  const isItalic = node.marks?.some((m) => m.type === "italic");
  const isUnderline = node.marks?.some((m) => m.type === "underline");

  return (
    <Text
      key={index}
      style={{
        fontWeight: isBold ? "bold" : "normal",
        fontStyle: isItalic ? "italic" : "normal",
        textDecoration: isUnderline ? "underline" : "none",
      }}
    >
      {node.text}
    </Text>
  );
}

export default function Index({
  values,
  content,
  signature,
  institution = null,
}) {
  if (!values && !institution) return null;
  let institut = null;
  let username = "";

  if (institution) {
    institut = institution?.institution;
    username = institution?.username;
  }
  const { user, accessToken, setAccessToken, setUser } = useAuth();

  const getActiveToken = async () => {
    const currentTime = new Date().getTime();
    if (user?.exp * 1000 < currentTime) {
      const response = await token();
      setAccessToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setUser(decoded);
      return response.data.accessToken;
    }
    return accessToken;
  };

  const fetchUserById = async (id) => {
    const t = await getActiveToken();
    const user = await getUserById(id, t);

    return user.data;
  };

  const { data: currentUser } = useSWR(`user-${user.id}`, () =>
    fetchUserById(user.id),
  );

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const bulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const date = new Date(dateString);
    const tgl = date.getDate();
    const bln = bulan[date.getMonth()];
    const thn = date.getFullYear();
    return `${tgl} ${bln} ${thn}`;
  };

  const formatGender = (gender) => {
    if (gender === "L") return "Laki-Laki";
    if (gender === "P") return "Perempuan";
    return "-";
  };

  return (
    <PDFViewer width="100%" height={640}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>Section #1</Text>
          </View>
          <View style={styles.section}>
            <Text>Section #2</Text>
          </View>
        </Page>
      </Document>
      <Document title="Recommendation Letter">
        <Page size="A4" style={styles.page}>
          <View style={styles.cop}>
            <Text style={styles.copTextTitle}>Dinas Kesehatan</Text>
            <Text style={styles.copTextSubTitle}>
              UPT {institut?.name ?? currentUser?.institution?.name ?? "-"}
            </Text>
            <Text style={styles.copTextSubTitle}>
              {institut
                ? institut.address
                : (currentUser?.institution?.address ?? "-")}
            </Text>
            <Text style={styles.copTextContent}>
              {institut
                ? institut.phone
                : (currentUser?.institution?.phone ?? "-")}
              |{" "}
              {institut
                ? institut.email
                : (currentUser?.institution?.email ?? "-")}
            </Text>
            <Text style={styles.copBorderBottom}></Text>
          </View>
          <View style={styles.header}>
            <Text style={styles.headerText}>SURAT REKOMENDASI</Text>
          </View>
          <View style={styles.information}>
            <Text style={styles.informationTextTitle}>
              Dengan ini kami sampaikan bahwa berdasarkan hasil pemantauan
              melalui sistem aplikasi gizi sekolah dasar yang di rujuk oleh{" "}
              {values.submittedBy?.institution?.name}, ditemukan data siswa
              berikut:
            </Text>
            <View style={styles.informationTextContainer}>
              <Text style={styles.informationText1}>Nama Siswa</Text>
              <Text style={styles.informationText2}>:</Text>
              <Text style={styles.informationText3}>
                {values?.student?.familyMember?.fullName || "-"}
              </Text>
            </View>
            <View style={styles.informationTextContainer}>
              <Text style={styles.informationText1}>NISN</Text>
              <Text style={styles.informationText2}>:</Text>
              <Text style={styles.informationText3}>
                {values?.student?.nis || "-"}
              </Text>
            </View>
            <View style={styles.informationTextContainer}>
              <Text style={styles.informationText1}>Tanggal Lahir</Text>
              <Text style={styles.informationText2}>:</Text>
              <Text style={styles.informationText3}>
                {formatDate(values?.student?.familyMember?.birthDate) ?? "-"}
              </Text>
            </View>
            <View style={styles.informationTextContainer}>
              <Text style={styles.informationText1}>Jenis Kelamin</Text>
              <Text style={styles.informationText2}>:</Text>
              <Text style={styles.informationText3}>
                {formatGender(values?.student?.familyMember?.gender) ?? "-"}
              </Text>
            </View>
            <View style={styles.informationTextContainer}>
              <Text style={styles.informationText1}>Alamat</Text>
              <Text style={styles.informationText2}>:</Text>
              <Text style={styles.informationText3}>
                {values?.student?.familyMember?.SocioEconomic?.address ?? "-"}
              </Text>
            </View>
            <View style={styles.informationTextContainer}>
              <Text style={styles.informationText1}>Orang Tua / Wali</Text>
              <Text style={styles.informationText2}>:</Text>
              <Text style={styles.informationText3}>
                {values.student?.familyMember?.family?.user?.family
                  ?.familyMember[0]?.fullName ?? "-"}
              </Text>
            </View>
          </View>
          <View style={styles.description}>
            {/* <Text style={styles.descriptionText}> */}
            {renderTiptapToPdf(content)}
            {/* {content} */}
            {/* Dengan ini kami merekomendasikan agar siswa yang bersangkutan
              dapat dilakukan pemeriksaan lanjutan oleh tenaga kesehatan di
              Puskesmas. */}
            {/* </Text> */}
          </View>
          <View style={styles.footer}>
            <Text style={styles.descriptionText}>
              {/* {recommendation?.student?.institution?.province?.name},{" "} */}
              {/* {formatDate(recommendation?.student?.familyMember?.birthDate) ||
                "-"} */}
              {getCurrrentDate() ?? "-"}
            </Text>
            <View style={styles.imageWrapper}>
              {signature && <Image src={signature} style={styles.image} />}
            </View>
            <Text style={styles.signatureName}>
              {institution?.staff?.fullName ??
                institution?.username ??
                currentUser?.staff?.fullName ??
                currentUser?.username ??
                "-"}
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
