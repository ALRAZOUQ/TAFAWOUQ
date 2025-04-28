import { useState, useEffect } from "react";
import { MonthPicker, MonthInput } from "react-lite-month-picker";

function Example({ secondMonth, setSecondMonth }) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <div id="monthpickerContainerX" className="flex-shrink-0  !mb-0">
      <MonthInput
        size="small"
        selected={secondMonth}
        setShowMonthPicker={setIsPickerOpen}
        showMonthPicker={isPickerOpen}
        // TODO Razouq: if the white bg is then we can chnage it
        textColor="#172554"
        bgColor="transparent"
      />
      {isPickerOpen ? (
        <MonthPicker
          size="small"
          bgColorMonthActive={"#cbecfd"}
          setIsOpen={setIsPickerOpen}
          selected={secondMonth}
          onChange={setSecondMonth}
        />
      ) : null}
    </div>
  );
}

export default Example;
