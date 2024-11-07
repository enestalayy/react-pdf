import React, { useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { highlightPlugin } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";

const PDFTest = () => {
  const [highlights, setHighlights] = useState([]);

  const renderHighlightTarget = (props) => {
    const { selectedText } = props;

    return (
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(0, 0, 0, 0.3)",
          borderRadius: "2px",
          padding: "8px",

          left: `${props.selectionRegion.left}px`,
          top: `${props.selectionRegion.top + props.selectionRegion.height}px`,
          zIndex: 1,
        }}
      >
        <button
          style={{
            backgroundColor: "#007bff",
            border: "none",
            borderRadius: "4px",
            color: "#ffffff",
            cursor: "pointer",
            padding: "8px",
          }}
          onClick={() => {
            const highlightContent = {
              selectedText,
              id: `highlight-${Date.now()}`,
              timestamp: new Date().toISOString(),
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

    return (
      <div
        style={{
          background: "#000",
          border: "1px solid rgba(0, 0, 0, 0.3)",
          borderRadius: "2px",
          padding: "8px",

          left: `${props.selectionRegion.left}px`,
          top: `${props.selectionRegion.top + props.selectionRegion.height}px`,
          zIndex: 10000,
        }}
      >
        <div>{props.content.selectedText}</div>
        <div
          style={{
            display: "flex",
            marginTop: "8px",
          }}
        >
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
    highlights: highlights.map((highlight) => ({
      content: highlight,
      position: {
        boundingRect: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 0,
          width: 0,
          height: 0,
        },
        rects: [],
        pageIndex: 0,
      },
    })),
  });

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      {/* PDF Viewer */}
      <div style={{ flex: 1, height: "100%" }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <div style={{ height: "100%" }}>
            <Viewer
              defaultScale={1}
              fileUrl="/sample.pdf"
              plugins={[highlightPluginInstance]}
            />
          </div>
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
              }}
            >
              <div style={{ marginBottom: "4px" }}>
                <strong>{highlight.selectedText}</strong>
              </div>
              <div style={{ color: "#666", fontSize: "0.875rem" }}>
                {new Date(highlight.timestamp).toLocaleTimeString()}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Highlight styles */}
      <style>
        {`
          .rpv-highlight {
            background-color: rgba(255, 235, 59, 0.4);
            border-radius: 3px;
          }
        `}
      </style>
    </div>
  );
};

export default PDFTest;
