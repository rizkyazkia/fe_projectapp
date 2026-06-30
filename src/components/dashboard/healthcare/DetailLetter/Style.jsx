import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
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
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: "row",
    marginTop: 20,
    paddingHorizontal: 50,
  },
});
