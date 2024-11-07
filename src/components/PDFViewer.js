import React, { useState, useCallback } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { highlightPlugin } from "@react-pdf-viewer/highlight";
import { dropPlugin } from "@react-pdf-viewer/drop";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";

const PDFViewer = () => {
  const [pdfUrl, setPdfUrl] = useState("/sample.pdf");
  const [highlights, setHighlights] = useState([]);
  const [currentHighlightColor, setCurrentHighlightColor] = useState("#FCE897");

  // Önceden tanımlanmış renkler
  const predefinedColors = [
    { label: "Yellow", value: "#FCE897" },
    { label: "Green", value: "#90EE90" },
    { label: "Blue", value: "#87CEFA" },
    { label: "Pink", value: "#FFB6C1" },
    { label: "Orange", value: "#FFD700" },
  ];

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [...defaultTabs],
  });

  const renderHighlightTarget = (props) => {
    const { selectedText, selectionRegion } = props;

    return (
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(0, 0, 0, 0.3)",
          borderRadius: "2px",
          padding: "8px",
          position: "absolute",
          left: `${selectionRegion.left}px`,
          top: `${selectionRegion.top + selectionRegion.height}px`,
          zIndex: 1,
        }}
      >
        <div style={{ marginBottom: "8px" }}>
          {predefinedColors.map((color) => (
            <button
              key={color.value}
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: color.value,
                border:
                  currentHighlightColor === color.value
                    ? "2px solid black"
                    : "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                margin: "0 4px",
              }}
              onClick={() => setCurrentHighlightColor(color.value)}
              title={color.label}
            />
          ))}
        </div>
        <button
          style={{
            backgroundColor: "#007bff",
            border: "none",
            borderRadius: "4px",
            color: "#ffffff",
            cursor: "pointer",
            padding: "8px",
            width: "100%",
          }}
          onClick={() => {
            const highlightContent = {
              selectedText,
              id: `highlight-${Date.now()}`,
              timestamp: new Date().toISOString(),
              color: currentHighlightColor,
            };
            setHighlights((prev) => [...prev, highlightContent]);
          }}
        >
          Highlight
        </button>
      </div>
    );
  };

  const renderHighlightContent = (props) => {
    const deleteHighlight = () => {
      setHighlights((highlights) =>
        highlights.filter((highlight) => highlight.id !== props.content.id)
      );
    };

    const changeHighlightColor = (newColor) => {
      setHighlights((highlights) =>
        highlights.map((highlight) =>
          highlight.id === props.content.id
            ? { ...highlight, color: newColor }
            : highlight
        )
      );
    };

    return (
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(0, 0, 0, 0.3)",
          borderRadius: "2px",
          padding: "8px",
          position: "absolute",
          left: `${props.selectionRegion.left}px`,
          top: `${props.selectionRegion.top + props.selectionRegion.height}px`,
          zIndex: 10000,
        }}
      >
        <div>{props.content.selectedText}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          <div style={{ display: "flex", gap: "4px" }}>
            {predefinedColors.map((color) => (
              <button
                key={color.value}
                style={{
                  width: "24px",
                  height: "24px",
                  backgroundColor: color.value,
                  border:
                    props.content.color === color.value
                      ? "2px solid black"
                      : "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => changeHighlightColor(color.value)}
                title={color.label}
              />
            ))}
          </div>
          <button
            onClick={deleteHighlight}
            style={{
              backgroundColor: "#e74c3c",
              border: "none",
              borderRadius: "4px",
              color: "#ffffff",
              cursor: "pointer",
              padding: "8px",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    renderHighlightContent,
  });

  const dropPluginInstance = dropPlugin({
    onDrop: (event) => {
      try {
        const files = event.dataTransfer.files;
        if (files.length === 0) return;

        const file = files[0];
        if (file.type !== "application/pdf") {
          console.error("Not a PDF file");
          return;
        }

        setPdfUrl(URL.createObjectURL(file));
      } catch (error) {
        console.error("File drop error:", error);
      }
    },
  });

  const handleDownload = useCallback(() => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "document.pdf";
      link.click();
    }
  }, [pdfUrl]);

  return (
    <div
      className="pdf-viewer-container"
      style={{ height: "100vh", display: "flex" }}
    >
      {/* Varsayılan Highlight Renk Seçici */}
      {/* <div
        style={{
          position: "fixed",
          top: "20px",
          right: "340px", // Highlight panelinin solunda
          zIndex: 1000,
          background: "white",
          padding: "10px",
          borderRadius: "4px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ marginBottom: "8px" }}>Default Highlight Color:</div>
        <div style={{ display: "flex", gap: "8px" }}>
          {predefinedColors.map((color) => (
            <button
              key={color.value}
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: color.value,
                border:
                  currentHighlightColor === color.value
                    ? "2px solid black"
                    : "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => setCurrentHighlightColor(color.value)}
              title={color.label}
            />
          ))}
        </div>
      </div> */}

      {/* PDF Viewer */}
      <div style={{ flex: 1, height: "100%", position: "relative" }}>
        {/* <button
          onClick={handleDownload}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            zIndex: 1000,
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Download PDF
        </button> */}

        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer
            fileUrl={pdfUrl}
            plugins={[
              defaultLayoutPluginInstance,
              highlightPluginInstance,
              dropPluginInstance,
            ]}
            defaultScale={1}
          />
        </Worker>
      </div>

      {/* Highlights Panel */}
      <div
        style={{
          width: "300px",
          padding: "20px",
          backgroundColor: "#f5f5f5",
          overflowY: "auto",
        }}
      >
        <h3>Highlights ({highlights.length})</h3>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {highlights.map((highlight) => (
            <li
              key={highlight.id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "4px",
                marginBottom: "8px",
                padding: "12px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                borderLeft: `4px solid ${highlight.color}`,
              }}
            >
              <div style={{ marginBottom: "4px" }}>
                <strong>{highlight.selectedText}</strong>
              </div>
              <div style={{ color: "#666", fontSize: "0.875rem" }}>
                {new Date(highlight.timestamp).toLocaleTimeString()}
              </div>
              <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
                {predefinedColors.map((color) => (
                  <button
                    key={color.value}
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: color.value,
                      border:
                        highlight.color === color.value
                          ? "2px solid black"
                          : "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setHighlights((prevHighlights) =>
                        prevHighlights.map((h) => {
                          console.log("renk", h);

                          return h.id === highlight.id
                            ? { ...h, color: color.value }
                            : h;
                        })
                      );
                    }}
                    title={color.label}
                  />
                ))}
                <button
                  onClick={() => {
                    setHighlights((prevHighlights) =>
                      prevHighlights.filter((h) => h.id !== highlight.id)
                    );
                  }}
                  style={{
                    backgroundColor: "#e74c3c",
                    border: "none",
                    borderRadius: "4px",
                    color: "#ffffff",
                    cursor: "pointer",
                    padding: "4px 8px",
                    marginLeft: "auto",
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Highlight styles */}
      <style>
        {`
          .rpv-highlight {
            border-radius: 3px;
          }
          ${highlights
            .map(
              (highlight) => `
            [data-highlight-id="${highlight.id}"] {
              background-color: ${highlight.color}66 !important;
            }
          `
            )
            .join("\n")}
        `}
      </style>
    </div>
  );
};

export default PDFViewer;
