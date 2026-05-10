import { safetyFeatures } from "../../../utils/LandingPage/Safety";
import SafetyFeatureRow from "./SafetyFeatureRow";

function SafetyFeaturesCard() {
  return (
    <div className="border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl md:p-10 rounded-4xl">
      <h2
        id="safety-heading"
        className="text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl"
      >
        Your safety always comes first
      </h2>
      <ul className="mt-8 flex list-none flex-col gap-8 p-0">
        {safetyFeatures.map((f) => (
          <li key={f.title}>
            <SafetyFeatureRow title={f.title} body={f.body} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SafetyFeaturesCard;
