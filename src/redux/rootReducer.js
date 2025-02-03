import { combineReducers } from "redux";
import onboardingReducer from "./onboarding/onboardingSlice";
import filterReducer from "./filter/filterSlice";
import tripReducer from "./trip/tripSlice";
import contentReducer from "./content/contentSlice";

const rootReducer = combineReducers({
  onboarding: onboardingReducer,
  filter: filterReducer,
  trip: tripReducer,
  content: contentReducer,
});

export default rootReducer;
