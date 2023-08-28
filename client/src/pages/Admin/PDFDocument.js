import React from "react";
import { Page, Document, Text, View, StyleSheet } from "@react-pdf/renderer";

const generateRandomInvoiceNumber = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = 8;
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 30,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textTransform: "uppercase", // Convert header to uppercase
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  table: {
    display: "table",
    width: "100%",
    borderCollapse: "collapse",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCell: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
  },
});

const PDFDocument = ({ searchData, filteredProducts }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Invoice</Text>
      <View style={styles.section}>
        <Text>Sold By: Manasvi technologies (opc) pvt. ltd.</Text>
        <Text>Billing To: {searchData?.buyerName}</Text>
        <Text>Address: ABC Private Limited</Text>
        <Text>Shipping to: {searchData?.buyerAddress}</Text>
        <Text>Pan no.: bjhhh2944</Text>
        <Text>Invoice No: {generateRandomInvoiceNumber()}</Text>
        <Text>GST-IN: 132942389</Text>
        <Text>Order Date: {searchData?.createdAt && (
      <>{new Date(searchData.createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      })}</>
    )}</Text>
        {/* <Text>Select State: {selectedTaxType}</Text> */}

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>S.no</View>
            <View style={styles.tableCell}>Product Name</View>
            <View style={styles.tableCell}>Qty</View>
            {/* ... other header cells ... */}
          </View>
          {filteredProducts.map((p, j) => (
            <View style={styles.tableRow} key={j}>
              <View style={styles.tableCell}>{j + 1}</View>
              <View style={styles.tableCell}>{p.name}</View>
              <View style={styles.tableCell}>{p.customQuantity}</View>
              {/* ... other data cells ... */}
            </View>
          ))}
        </View>

        <Text>Total Price: {calculateTotalPrice(filteredProducts)}</Text>
      </View>
    </Page>
  </Document>
);

function calculateTotalPrice(products) {
  return products.reduce((total, p) => total + p.customQuantity * p.price, 0);
}

export default PDFDocument;