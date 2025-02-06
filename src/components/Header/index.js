import { DropdownMenu, ScrollArea } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ReactComponent as DropdownIcon } from "../../assets/dropdown-icon.svg";
import HeaderLogo from "../../assets/images/header-logo.png";
import { setTime } from "../../redux/onboarding/onboardingSlice";
import { setSelectedFilters } from "../../redux/filter/filterSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { city, step } = useSelector((state) => state.onboarding);
  const { selectedFilters } = useSelector((state) => state.filter);
  const { hours } = useSelector((state) => state.filter);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (step !== 5) {
      navigate("/");
      return;
    }
  }, []);

  const handleTimeSelect = (selectedTime) => {
    dispatch(setTime(selectedTime));
    const selectFiltersObject = {
      ...selectedFilters,
      "Traveling Time": selectedTime,
    };
    dispatch(setSelectedFilters(selectFiltersObject));
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <>
      <div className="flex justify-between items-center px-4 py-3">
        <img
          src={HeaderLogo}
          className=""
          alt=""
          onClick={() => navigate("/home")}
        />

        {window.location.pathname === "/cart" ? (
          <span className="flex cursor-pointer items-center gap-1.5 text-black1 font-semibold text-[15px]">
            {city?.cityName}
          </span>
        ) : (
          <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu.Trigger>
              <span className="flex cursor-pointer items-center gap-1.5 text-black1 font-semibold text-[15px] time-selection">
                {city?.cityName}
                <div className="w-1 h-1 bg-black rounded-full"></div>
                {selectedFilters["Traveling Time"]?.name}
                <DropdownIcon className="ml-1 h-3 w-3" />
              </span>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="p-1 bg-white shadow-lg rounded-lg w-52">
              <ScrollArea
                radius="medium"
                type="auto"
                scrollbars="vertical"
                style={{ height: 250 }}
              >
                <div className="space-y-1">
                  {hours.map((timeSlot) => (
                    <div
                      key={timeSlot.code}
                      onClick={() => handleTimeSelect(timeSlot)}
                      className={`px-2 py-1.5 font-medium text-sm cursor-pointer hover:bg-[#FFF5f1] ${
                        selectedFilters["Traveling Time"]?.code ===
                        timeSlot.code
                          ? "bg-[#FFF5F1] text-orange1"
                          : ""
                      }`}
                    >
                      {timeSlot.name}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      </div>
      <hr color="#B3B8D6" />
    </>
  );
};

export default Header;
