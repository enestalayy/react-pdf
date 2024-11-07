// import logo from "./logo.svg";
// import "./App.css";

// // src/App.js
// import React from "react";
// import PDFViewer from "./components/PDFViewer";

// function App() {
//   // PDF dosyasının URL'sini belirtin (örneğin, public klasöründe bir PDF)
//   const pdfUrl = "/sample.pdf";

//   return (
//     <div className="App">
//       <h1>PDF Metin Vurgulama Uygulaması</h1>
//       <PDFViewer pdfUrl={pdfUrl} />
//     </div>
//   );
// }

// export default App;

import PDFViewer from "./components/PDFViewer";
import PDFTest from "./components/PDFTest";

function App() {
  return (
    <div className="App">
      <PDFViewer />
      {/* <PDFTest /> */}
    </div>
  );
}
export default App;
