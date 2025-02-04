import React, { useState, useEffect } from "react";
import {
  IconButton,
  SwipeableDrawer,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactComponent as FilterIcon } from "../../assets/filter-icon.svg";
import { Filter, PlusIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedFilters,
  resetFilters,
} from "../../redux/filter/filterSlice";
import * as Tabs from "@radix-ui/react-tabs";

const DrawerPaper = styled("div")({
  minHeight: "50%",
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
  overflow: "hidden",
});

const FilterButton = () => {
  const dispatch = useDispatch();
  const {
    categories,
    hours,
    languages,
    pickPoints,
    selectedFilters: persistedFilters,
  } = useSelector((state) => state.filter);
  const { time, language, pickPoint } = useSelector(
    (state) => state.onboarding
  );

  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Places");
  const [selectedFilters, setSelectedFiltersLocal] = useState({
    Places: [],
    Languages: null,
    "Traveling Time": null,
    "Current Location": null,
  });
  const [isApplyEnabled, setIsApplyEnabled] = useState(false);

  const tabs = [
    { name: "Places", type: "checkbox", tabContent: categories },
    { name: "Languages", type: "radio", tabContent: languages },
    { name: "Traveling Time", type: "radio", tabContent: hours },
    { name: "Current Location", type: "radio", tabContent: pickPoints },
  ];

  useEffect(() => {
    if (open) {
      setSelectedFiltersLocal(persistedFilters);
    }
  }, [open, persistedFilters]);

  const haveFiltersChanged = () => {
    return JSON.stringify(selectedFilters) !== JSON.stringify(persistedFilters);
  };

  useEffect(() => {
    setIsApplyEnabled(haveFiltersChanged());
  }, [selectedFilters, persistedFilters]);

  const toggleDrawer = (isOpen) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    if (!isOpen) {
      setSelectedFiltersLocal(persistedFilters);
    }
    setOpen(isOpen);
  };

  const handleCheckboxChange = (tabName, option) => {
    setSelectedFiltersLocal((prev) => {
      const selectedTabFilters = prev[tabName] || [];
      const isSelected = selectedTabFilters.some(
        (item) => item.code === option.code
      );

      if (isSelected) {
        // Remove the item from array
        return {
          ...prev,
          [tabName]: selectedTabFilters.filter(
            (item) => item.code !== option.code
          ),
        };
      } else {
        // Add the item to array
        return {
          ...prev,
          [tabName]: [...selectedTabFilters, option],
        };
      }
    });
  };

  const handleRadioChange = (tabName, option) => {
    setSelectedFiltersLocal((prev) => ({
      ...prev,
      [tabName]: option, // Store only one object
    }));
  };

  const handleApply = () => {
    if (isApplyEnabled) {
      dispatch(setSelectedFilters(selectedFilters));
      setOpen(false);
    }
  };

  const handleReset = () => {
    dispatch(
      resetFilters({
        Places: [],
        Languages: language,
        "Traveling Time": time,
        "Current Location": pickPoint,
      })
    );
    setSelectedFiltersLocal({
      Places: [],
      Languages: language,
      "Traveling Time": time,
      "Current Location": pickPoint,
    });
  };

  return (
    <>
      <div
        className="absolute bottom-24 right-2 rounded-full h-12 w-12 bg-orange1 flex items-center justify-center cursor-pointer"
        onClick={toggleDrawer(true)}
      >
        <FilterIcon className="h-5 w-5" />
      </div>

      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        PaperProps={{ component: DrawerPaper }}
        swipeAreaWidth={56}
        disableSwipeToOpen={false}
        ModalProps={{ keepMounted: true }}
        sx={{ fontFamily: "Public Sans, serif", zIndex: 99999 }}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 pt-6 flex justify-center mb-2 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <PlusIcon className="rotate-45 stroke-gray-600" />
          </IconButton>

          <div className="text-orange1 px-3.5 py-1 w-full border-b border-[#B3B8D6]">
            <span className="capitalize font-bold inline-flex items-center gap-1.5">
              <Filter className="stroke-orange1 h-5 w-5" /> Filter
            </span>
          </div>

          <div className="flex flex-grow overflow-hidden">
            <Tabs.Root
              orientation="vertical"
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="flex w-full"
            >
              <Tabs.List className="flex flex-col border-r border-[#B3B8D6] w-[150px]">
                {tabs.map((tab) => (
                  <Tabs.Trigger
                    key={tab.name}
                    value={tab.name}
                    className={`text-left cursor-pointer p-2.5 w-full font-medium text-sm tracking-wide ${
                      tab.name === selectedTab
                        ? "text-orange1 bg-[#E9EDEF] bg-opacity-50 border-l-2 border-orange1"
                        : "text-black1"
                    }`}
                  >
                    {tab.name}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              <div className="flex-1 px-4 py-2 overflow-y-auto">
                {tabs.map((tab) => (
                  <Tabs.Content key={tab.name} value={tab.name}>
                    <div className="flex flex-col">
                      {tab.type === "checkbox" ? (
                        tab.tabContent.map((option) => {
                          const isChecked = selectedFilters[tab.name]?.some(
                            (item) => item.code === option.code
                          );

                          return (
                            <FormControlLabel
                              key={option.code}
                              control={
                                <Checkbox
                                  checked={isChecked}
                                  onChange={() =>
                                    handleCheckboxChange(tab.name, option)
                                  }
                                  color="primary"
                                  sx={{
                                    padding: "6px",
                                    "& .MuiSvgIcon-root": { fontSize: "20px" },
                                    "&.Mui-checked": { color: "#ED5722" },
                                  }}
                                />
                              }
                              label={option.name}
                              sx={{
                                "& .MuiTypography-root": {
                                  fontFamily:
                                    "Public Sans, sans-serif !important",
                                  fontSize: "14px",
                                  color: "#182138",
                                },
                              }}
                            />
                          );
                        })
                      ) : (
                        <RadioGroup
                          value={selectedFilters[tab.name]?.code || ""}
                          onChange={(e) => {
                            const selectedOption = tab.tabContent.find(
                              (item) => item.code == e.target.value
                            );
                            handleRadioChange(tab.name, selectedOption);
                          }}
                        >
                          {tab.tabContent.map((option) => (
                            <FormControlLabel
                              key={option.code}
                              value={option.code}
                              control={
                                <Radio
                                  color="primary"
                                  sx={{
                                    padding: "6px",
                                    "& .MuiSvgIcon-root": { fontSize: "20px" },
                                    "&.Mui-checked": { color: "#ED5722" },
                                  }}
                                />
                              }
                              label={option.name}
                              sx={{
                                "& .MuiTypography-root": {
                                  fontFamily:
                                    "Public Sans, sans-serif !important",
                                  fontSize: "14px",
                                  color: "#182138",
                                },
                              }}
                            />
                          ))}
                        </RadioGroup>
                      )}
                    </div>
                  </Tabs.Content>
                ))}
              </div>
            </Tabs.Root>
          </div>

          <div className="bg-white border-t border-t-[#B3B8D6] min-h-20 w-full font-semibold grid grid-cols-2 gap-4 p-3">
            <button
              className="text-black1 w-full h-full border border-orange1 rounded-lg"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              className={`text-white w-full h-full bg-orange1 rounded-lg ${
                isApplyEnabled ? "" : "bg-opacity-50 cursor-not-allowed"
              }`}
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      </SwipeableDrawer>
    </>
  );
};

export default FilterButton;
