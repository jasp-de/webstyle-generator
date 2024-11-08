export default function StyleCard({ style }) {
  const { text, info, css } = style;

  return (
    <div className="style-card">
      <div className="style-frame" style={css.frame}>
        <h1 style={css.h1}>{text.title}</h1>
        <p style={css.p}>{text.shortDescription}</p>
        <button style={css.button}>{text.buttonText}</button>
      </div>
      <div className="style-info">
        <div className="style-name">{info.name}</div>
        <div className="style-details">
          <code>
            <strong>Font:</strong> {info.fontname}
            <br />
            <strong>Colors:</strong> {info.colorScheme}
            <br />
            <strong>Style:</strong> {info.style}
            <br />
            <strong>Features:</strong> {info.features}
          </code>
        </div>
      </div>
    </div>
  );
}
