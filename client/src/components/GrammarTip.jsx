export default function GrammarTip({ tip, onDismiss }) {
  if (!tip) return null;

  return (
    <div className="grammar-tip slide-up">
      <button className="grammar-tip-dismiss" onClick={onDismiss}>
        &#10005;
      </button>
      <div className="grammar-tip-title">
        &#9733; Grammar Tip: {tip.title}
      </div>
      <div className="grammar-tip-content">
        {tip.content}
      </div>
    </div>
  );
}
