import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    // flexDirection: "row",
    backgroundColor: "#FFF",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  cop: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 50,
  },
  copTextTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  copTextSubTitle: {
    fontSize: 15,
    marginTop: 2,
  },
  copTextContent: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10,
  },
  copBorderBottom: {
    width: "100%",
    height: 1,
    backgroundColor: "#000",
    marginTop: 10,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  information: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
    paddingHorizontal: 50,
  },
  informationTextTitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  informationTextContainer: {
    display: "flex",
    flexDirection: "row",
    fontSize: 12,
    marginBottom: 5,
    gap: 10,
  },
  informationText1: {
    maxWidth: "100px",
    minWidth: "100px",
  },
  informationText2: {
    maxWidth: "5px",
    minWidth: "5px",
  },
  informationText3: {
    maxWidth: "250px",
    textTransform: "capitalize",
  },
  description: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
    paddingHorizontal: 50,
  },
  descriptionText: {
    fontSize: 12,
    marginBottom: 5,
    position: "relative",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: 20,
    paddingHorizontal: 50,
    position: "relative",
  },
  imageWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  image: {
    width: "7rem",
    height: "auto",
  },
  signatureName: {
    fontWeight: "bold",
    textDecoration: "underline",
  },
});
