import { combineReducers } from "redux";
import onboardingReducer from "./onboarding/onboardingSlice";

const rootReducer = combineReducers({
  onboarding: onboardingReducer,
});

export default rootReducer;
