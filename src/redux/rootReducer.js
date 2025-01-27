import { combineReducers } from "redux";
import onboardingReducer from "./onboarding/onboardingSlice";
import filterReducer from "./filter/filterSlice";
import tripReducer from "./trip/tripSlice";

const rootReducer = combineReducers({
  onboarding: onboardingReducer,
  filter: filterReducer,
  trip: tripReducer,
});

export default rootReducer;
