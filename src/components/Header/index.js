import { DropdownMenu, ScrollArea } from "@radix-ui/themes";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as DropdownIcon } from "../../assets/dropdown-icon.svg";
import HeaderLogo from "../../assets/images/header-logo.png";
import { setHourList } from "../../redux/filter/filterSlice";
import { setTime } from "../../redux/onboarding/onboardingSlice";
import apiService from "../../services/api/apiServices";

const Header = () => {
  const dispatch = useDispatch();
  const { city, time } = useSelector((state) => state.onboarding);
  const { hours } = useSelector((state) => state.filter);

  useEffect(() => {
    fetchHours();
  }, []);

  const handleTimeSelect = (selectedTime) => {
    dispatch(setTime(selectedTime));
  };

  const fetchHours = async () => {
    try {
      const response = await apiService.getHours();
      const hours = response || [];
      dispatch(setHourList(hours));
    } catch (err) {
      console.log("Failed to fetch Hours. Please try again.");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center px-4 py-3">
        <img src={HeaderLogo} className="" alt="" />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <span className="flex cursor-pointer items-center gap-1.5 text-black1 font-semibold text-[15px]">
              {city?.cityName}
              <div className="w-1 h-1 bg-black rounded-full"></div>
              {time?.name}
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
                      time?.code === timeSlot.code
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
      </div>
      <hr color="#B3B8D6" />
    </>
  );
};

export default Header;
