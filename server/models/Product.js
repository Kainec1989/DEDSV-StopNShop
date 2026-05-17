import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  // Produktname – wird im Text-Index und in Suchergebnissen verwendet.
  // `index: true` beschleunigt exakte Suchen und Sortierungen nach Name.
  product: { type: String, required: true, index: true },

  // Preis – häufig genutzt für Bereichsfilter (z.B. "unter 50 €") und
  // Sortierungen (aufsteigend/absteigend). Ein B-Tree-Index auf `price`
  // macht range queries ( {$gte, $lte} ) effizient ohne Collection-Scan.
  price: { type: Number, required: true, index: true },

  // Beschreibung – Teil des Volltextindex (siehe schema.index unten).
  // Kein eigenständiger Index nötig, da Text-Index dieses Feld abdeckt.
  description: { type: String, required: true },

  image: { type: String, required: true },

  // Kategorie – der mit Abstand häufigste Filterparameter im Storefront
  // ("/products/male", "/products/female"). Ein Index auf `category`
  // verhindert einen Full-Collection-Scan bei jeder Kategorieseite.
  category: {
    type: String,
    enum: ["male", "female", "jewerely"],
    index: true,
  },

  sizes: [
    {
      size: { type: String, required: true },
      // `countInStock` wird für Verfügbarkeitsfilter genutzt.
      // Der Index erlaubt effiziente Abfragen nach Lagerbestand > 0,
      // ohne alle eingebetteten Subdokumente zu durchsuchen.
      countInStock: { type: Number, required: true, default: 0 },
    },
  ],
});

// Zusammengesetzter Index: category + price
// Optimiert die häufigste Kombination: "Alle Herrenschuhe unter 80 €,
// sortiert nach Preis". MongoDB kann diesen Index für Filter UND Sortierung
// gleichzeitig nutzen (Index Prefix + Range Scan), was SORT-Stages entfällt.
productSchema.index({ category: 1, price: 1 });

// Volltextindex auf `product` (Name) und `description`.
// Ermöglicht $text-Abfragen ("SELECT * WHERE $text: { $search: 'sneaker' }").
// MongoDB tokenisiert, stemmt und gewichtet beide Felder;
// `product` erhält Gewicht 3 (Name-Treffer relevanter als Beschreibungs-Treffer).
// Nur ein Text-Index pro Collection erlaubt – daher kombinierter Index.
productSchema.index(
  { product: "text", description: "text" },
  { weights: { product: 3, description: 1 }, name: "ProductTextSearch" }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
