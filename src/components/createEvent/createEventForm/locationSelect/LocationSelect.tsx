import { Flex, Input, Text } from "@chakra-ui/react";
import Select, { components } from "react-select";
import { useEffect, useRef, useState } from "react";

const { MenuList, Control, Option } = components;

interface IProps {
  name?: "string";
  onChange: (data: any) => void;
  options: any[];
  defaultValue?: any;
  icon?: any;
  placeholder: string;
  isDisabled?: boolean;
  countryRef?: any;
  value: any;
}
export const LocationSelect = ({
  onChange,
  options,
  defaultValue = null,
  icon,
  placeholder,
  isDisabled = true,
  value,
}: IProps) => {
  const locationSelectRef = useRef(null) as any;

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const closeMenuOnClickOutside = (event) => {
      if (
        locationSelectRef.current &&
        !locationSelectRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    const elements = document.querySelectorAll(".chakra-portal");

    elements.forEach((element) => {
      element.addEventListener("click", closeMenuOnClickOutside);
    });
    document.addEventListener("click", closeMenuOnClickOutside);

    return () => {
      const elements = document.querySelectorAll(".chakra-portal");
      elements.forEach((element) => {
        element.removeEventListener("click", closeMenuOnClickOutside);
      });
    };
  }, []);
  return (
    <div ref={locationSelectRef} style={{ width: "inherit", height: "100%" }}>
      <Select
        isDisabled={isDisabled}
        menuIsOpen={isOpen}
        onMenuOpen={toggleMenu}
        onMenuClose={toggleMenu}
        onChange={(e) => {
          //@ts-ignore
          onChange(e);
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
          menuList: (prev) => ({
            ...prev,
            paddingTop: "0px",
            paddingBottom: "0px",
          }),
          menu: (prev) => ({
            ...prev,
            minWidth: "256px",
            borderRadius: "7px",
            overflow: "hidden",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            boxShadow: "0px 11px 24px 5px rgba(29, 29, 29, 0.3)",
            borderBottom: "1px solid #aaa",
          }),
        }}
        //@ts-ignore
        icon={icon || null}
        placeholder={placeholder}
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
const FormatOptionLabel = ({ label, flag, ...rest }) => {
  const isSelected = rest.isSelected;

  return (
    <Flex
      gap={2}
      alignItems={"center"}
      bg={isSelected ? "#ece9e9" : "transparent"}
      transition={"all 150ms"}
      py={"12px"}
      cursor={"pointer"}
      borderBottom={"1px solid"}
      borderColor={"#ddd"}
      px={4}
      _hover={{
        bg: "#ededed",
      }}
    >
      {!!flag && flag}
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
  const { onMenuOpen, value, icon, placeholder, isDisabled } =
    props.selectProps;

  const label = value?.label;
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
        gap={2}
        bg={"#ECEDEF"}
        h={"100%"}
        cursor={"pointer"}
      >
        {!!icon && icon}
        <Text
          fontWeight={"500"}
          fontSize={"1rem"}
          color={isDisabled ? "#b9b5b5" : "#0D151CA3"}
          whiteSpace={"nowrap"}
          overflow={"hidden"}
          textOverflow={"ellipsis"}
        >
          {!!label ? label : placeholder || ""}
        </Text>
      </Flex>
    </Control>
  );
};
