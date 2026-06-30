import { PDFViewer, Document, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./Style";

export default function Index({ recommendation, nomorUrut, parentData }) {
  const getRomanMonth = (month) => {
    const romans = [
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
      "XI",
      "XII",
    ];
    return romans[month];
  };

  const generateNoSurat = ({ nomorUrut, kodeSekolah, tanggal }) => {
    const date = new Date(tanggal);
    const bulanRomawi = getRomanMonth(date.getMonth());
    const tahun = date.getFullYear();
    const nomor = String(nomorUrut).padStart(3, "0");
    return `${nomor}/SD-${kodeSekolah}/${bulanRomawi}/${tahun}`;
  };

  const getKodeSekolah = (namaSekolah) => {
    return namaSekolah
      .replace(/(SD|SDN|SD Negeri)/gi, "SD")
      .split(" ")
      .map((kata) => kata[0])
      .join("")
      .toUpperCase();
  };

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

  if (!recommendation) return null;
  return (
    <PDFViewer width="100%" height={640}>
      <Document title="Recommendation Letter">
        <Page size="A4" style={styles.page}>
          <View style={styles.cop}>
            <Text style={styles.copTextTitle}>
              DINAS PENDIDIKAN PROVINSI DKI JAKARTA
            </Text>
            <Text style={styles.copTextSubTitle}>
              {recommendation?.student?.institution?.name}
            </Text>
            <Text style={styles.copTextSubTitle}>
              {recommendation?.student?.institution?.address}
            </Text>
            <Text style={styles.copTextContent}>
              {recommendation?.student?.institution?.phone} |{" "}
              {recommendation?.student?.institution?.email}
            </Text>
            <Text style={styles.copBorderBottom}></Text>
          </View>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              SURAT RUJUKAN PEMANTAUAN GIZI SISWA
            </Text>
            <Text style={styles.headerText}>
              No:{" "}
              {generateNoSurat({
                nomorUrut,
                kodeSekolah: getKodeSekolah(
                  recommendation?.student?.institution?.name
                ),
                tanggal: recommendation.createdAt,
              })}
            </Text>
          </View>
          <View style={styles.information}>
            <Text style={styles.informationTextTitle}>
              Dengan ini kami sampaikan bahwa berdasarkan hasil pemantauan
              melalui sistem aplikasi gizi sekolah dasar, ditemukan data siswa
              berikut:
            </Text>
            <View style={styles.informationTextContainer}>
              <Text style={styles.informationText1}>Nama Siswa</Text>
              <Text style={styles.informationText2}>:</Text>
              <Text style={styles.informationText3}>
                {recommendation?.student?.familyMember?.fullName || "-"}
              </Text>
            </View>
            <View style={styles.informationTextContainer}>
              <Text style={styles.informationText1}>NISN</Text>
              <Text style={styles.informationText2}>:</Text>
              <Text style={styles.informationText3}>
                {recommendation?.student?.nis || "-"}
              </Text>
            </View>
            <View style={styles.informationTextContainer}>
              <Text style={styles.informationText1}>Tanggal Lahir</Text>
              <Text style={styles.informationText2}>:</Text>
              <Text style={styles.informationText3}>
                {formatDate(recommendation?.student?.familyMember?.birthDate) ||
                  "-"}
              </Text>
            </View>
            <View style={styles.informationTextContainer}>
              <Text style={styles.informationText1}>Jenis Kelamin</Text>
              <Text style={styles.informationText2}>:</Text>
              <Text style={styles.informationText3}>
                {formatGender(recommendation?.student?.familyMember?.gender) ||
                  "-"}
              </Text>
            </View>
            <View style={styles.informationTextContainer}>
              <Text style={styles.informationText1}>Alamat</Text>
              <Text style={styles.informationText2}>:</Text>
              <Text style={styles.informationText3}>
                {recommendation?.student?.familyMember?.SocioEconomic?.address ||
                  "-"}
              </Text>
            </View>
            <View style={styles.informationTextContainer}>
              <Text style={styles.informationText1}>Orang Tua / Wali</Text>
              <Text style={styles.informationText2}>:</Text>
              <Text style={styles.informationText3}>
                {parentData && parentData.length > 0
                  ? parentData[0].fullName
                  : "-"}
              </Text>
            </View>
          </View>
          <View style={styles.description}>
            <Text style={styles.descriptionText}>
              Dengan ini kami merekomendasikan agar siswa yang bersangkutan
              dapat dilakukan pemeriksaan lanjutan oleh tenaga kesehatan di
              Puskesmas.
            </Text>
            <Text style={styles.descriptionText}>
              Demikian surat ini diterbitkan secara otomatis oleh sistem
              aplikasi pemantauan gizi sekolah dasar. Harap dapat
              ditindaklanjuti sebagaimana mestinya.
            </Text>
            <Text style={styles.descriptionText}>
              Surat ini dikeluarkan oleh Sistem Aplikasi Pemantauan Gizi Sekolah
              Dasar Dokumen ini sah tanpa tanda tangan karena dikeluarkan secara
              digital melalui sistem terverifikasi.
            </Text>
          </View>
          <View style={styles.footer}>
            <Text style={styles.descriptionText}>
              {recommendation?.student?.institution?.province?.name},{" "}
              {formatDate(new Date().toISOString()) || "-"}
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
