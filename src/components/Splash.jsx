import "./Splash.css";

export default function Splash({ videoUrl, onFinish }) {
  return (
    <div className="splash-container">
      <video
        src={videoUrl}
        autoPlay
        muted
        playsInline
        onEnded={onFinish}
        className="splash-video"
      />
    </div>
  );
}
