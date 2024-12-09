export default function Loader() {
  return (
    <div style={{ height: 50, width: 50 }}>
      <div className="loader">
        <svg className="circular">
          <circle
            className="path"
            cx="25"
            cy="25"
            fill="none"
            r="20"
            strokeMiterlimit="10"
            strokeWidth="5"
          />
        </svg>
      </div>
    </div>
  );
}
