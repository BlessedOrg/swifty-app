import { useTimezoneSelect, allTimezones } from "react-timezone-select";
const labelStyle = "original";

import { Flex, Input, Text } from "@chakra-ui/react";
import Select, { components } from "react-select";
import { Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";

const { MenuList, Control, Option } = components;

export const TimezoneSelect = ({ name, control, defaultValue }) => {
  const localeTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezones = {
    ...allTimezones,
    "Europe/Berlin": "Frankfurt",
    [localeTimezone]: localeTimezone,
  };

  const menuRef = useRef(null) as any;
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });
  const defaultZone =
    options.find((i) => {
      if (defaultValue) {
        return i.value === defaultValue;
      } else {
        return i.value === localeTimezone;
      }
    }) || options[0];

  const [value, setValue] = useState(defaultZone);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const closeMenuOnClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", closeMenuOnClickOutside);

    return () => {
      document.removeEventListener("click", closeMenuOnClickOutside);
    };
  }, []);
  return (
    <div ref={menuRef} style={{ width: "inherit", height: "100%" }}>
      <Controller
        render={({ field }) => (
          <Select
            menuIsOpen={isOpen}
            onMenuOpen={toggleMenu}
            onMenuClose={toggleMenu}
            onChange={(e) => {
              //@ts-ignore
              setValue(e);
              field.onChange(e?.value);
            }}
            value={value}
            options={options}
            defaultValue={value}
            components={{
              Control: CustomSelectControl,
              MenuList: CustomMenuList,
              Option: CustomOption,
            }}
            styles={{
              container: (prev) => ({
                ...prev,
                width: "100%",
                border: "none",
                height: "100%",
              }),
              control: (prev) => ({
                ...prev,
                border: "none",
                background: "transparent",
                height: "100%",
              }),
              option: () => ({}),
              menuList: (prev) => ({ ...prev, paddingTop: "0px" }),
              menu: (prev) => ({
                ...prev,
                minWidth: "340px",
                borderRadius: "7px",
                overflow: "hidden",
                left: "50%",
                transform: "translateX(-50%)",
              }),
            }}
          />
        )}
        name={name}
        control={control}
      />
    </div>
  );
};

const CustomOption = (props) => {
  const { isFocused, isSelected, data } = props;
  const optionProps = {
    ...data,
    isFocused,
    isSelected,
  };
  return (
    <Option {...props}>
      <FormatOptionLabel {...optionProps} />
    </Option>
  );
};
const FormatOptionLabel = ({ label }) => {
  return (
    <Flex
      gap={2}
      alignItems={"center"}
      bg={"transparent"}
      _hover={{
        bg: "#CDCD",
      }}
      transition={"all 200ms"}
      rounded={"8px"}
      p={"8px"}
      cursor={"pointer"}
    >
      <Text
        fontSize={"14px"}
        fontWeight={"600"}
        whiteSpace={"nowrap"}
        overflow={"hidden"}
        textOverflow={"ellipsis"}
      >
        {label}
      </Text>
    </Flex>
  );
};
const CustomMenuList = (props) => {
  const { selectProps } = props;
  const { onInputChange, inputValue, onMenuInputFocus } = selectProps;

  const ariaAttributes = {
    "aria-autocomplete": "list",
    "aria-label": selectProps["aria-label"],
    "aria-labelledby": selectProps["aria-labelledby"],
  } as any;
  return (
    <MenuList {...props}>
      <Flex flexDirection={"column"} gap={2} pos={"relative"}>
        <Flex pos={"sticky"} top={0} bg={"#fff"}>
          <Input
            rounded={0}
            type={"text"}
            border={"none"}
            borderBottom={"1px solid"}
            placeholder={"Search"}
            borderColor={"#DAD9DD"}
            value={inputValue}
            onChange={(e) =>
              onInputChange(e.currentTarget.value, {
                action: "input-change",
              })
            }
            onMouseDown={(e) => {
              e.stopPropagation();
              e.currentTarget.focus();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              e.currentTarget.focus();
            }}
            onFocus={onMenuInputFocus}
            {...ariaAttributes}
          />
        </Flex>
        {props?.children}
      </Flex>
    </MenuList>
  );
};

const CustomSelectControl = (props) => {
  const { onMenuOpen, value } = props.selectProps;

  const label = value.label;
  const regex = /\(GMT[+-][0-9]{1,2}:[0-9]{2}\)\s*(.*)/;
  const match = label.match(regex)?.[1];

  return (
    <Control {...props}>
      <Flex
        as={"button"}
        type={"button"}
        onClick={onMenuOpen}
        w={"100%"}
        p={"8px"}
        rounded={"12px"}
        fontSize={"12px"}
        flexDirection={"column"}
        justifyContent={"space-evenly"}
        gap={2}
        bg={"#ECEDEF"}
        h={"100%"}
        _hover={{
          bg: "#0d151c14"
        }}
        transition={"background 150ms ease-out"}
      >
        <Globe size={20} />
        <Text
          fontWeight={"bold"}
          fontSize={"1rem"}
          color={!!value?.label ? "#00" : "#9796A2"}
        >
          GMT
          {`${
            value.offset < 0 ? value.offset + ":00" : "+" + value.offset + ":00"
          }`}
        </Text>
        <Text>{match}</Text>
      </Flex>
    </Control>
  );
};
