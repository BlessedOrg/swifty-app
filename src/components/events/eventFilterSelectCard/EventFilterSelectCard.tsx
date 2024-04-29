"use client";
import { Flex, Input, Text } from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";
import Select, { components } from "react-select";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { EventFilterCard } from "@/components/events/eventFilterCard/EventFilterCard";
const { MenuList, Control, Option } = components;

interface IProps {
  options: { label: string; value: any }[];
  defaultValue: any;
  selectLabel: string;
  withBrowser?: boolean;
  placeholder?: string;
  onParamsChange?: (v: string) => void;
  withImage?: boolean;
  isLoading?: boolean;
  isSmallView?: boolean;
}
export const EventFilterSelectCard = ({
  options = [],
  defaultValue,
  selectLabel,
  withBrowser = false,
  placeholder = "",
  onParamsChange,
  withImage = false,
  isLoading = false,
  isSmallView,
}: IProps) => {
  const menuRef = useRef(null) as any;
  const [value, setValue] = useState<any>(defaultValue || null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (value === null && defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

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
      <Select
        isDisabled={isLoading}
        menuIsOpen={isOpen}
        onMenuOpen={toggleMenu}
        onMenuClose={toggleMenu}
        onChange={(e) => {
          if (typeof onParamsChange === "function") {
            onParamsChange(e?.value);
          }
          setValue(e);
        }}
        options={options}
        components={{
          Control: CustomSelectControl,
          MenuList: CustomMenuList,
          Option: CustomOption,
        }}
        defaultValue={value}
        value={value}
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
            minWidth: "240px",
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
        selectLabel={selectLabel}
        withBrowser={withBrowser}
        placeholder={placeholder}
        withImage={withImage}
        isLoading={isLoading}
        isSmallView={isSmallView}
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
      <FormatOptionLabel
        {...optionProps}
        withImage={props?.selectProps?.withImage}
      />
    </Option>
  );
};
const FormatOptionLabel = ({
  label,
  avatarUrl,
  withImage,
  clearField,
  ...rest
}) => {
  const isSelected = rest.isSelected;
  return (
    <Flex
      gap={2}
      alignItems={"center"}
      bg={isSelected ? "#ece9e9" : "transparent"}
      transition={"all 200ms"}
      py={"12px"}
      cursor={"pointer"}
      borderBottom={"1px solid"}
      borderColor={"#ddd"}
      px={4}
      _hover={{
        bg: "#ededed",
      }}
      transitionDuration={"all 150ms"}
    >
      {withImage && !clearField && (
        <Image
          src={avatarUrl || "/images/logo_dark.svg"}
          alt={`${label} avatar image`}
          width={50}
          height={50}
          style={{
            objectFit: "cover",
            borderRadius: "100%",
            maxHeight: "50px",
          }}
        />
      )}
      {clearField ? (
        <Text
          fontSize={clearField ? "15px" : "14px"}
          fontWeight={"bold"}
          w={"100%"}
        >
          {label}
        </Text>
      ) : (
        <Text
          fontSize={"14px"}
          fontWeight={"600"}
          whiteSpace={"nowrap"}
          overflow={"hidden"}
          textOverflow={"ellipsis"}
        >
          {label}
        </Text>
      )}
    </Flex>
  );
};
const CustomMenuList = (props) => {
  const { onInputChange, inputValue, onMenuInputFocus, withBrowser } =
    props.selectProps;

  const ariaAttributes = {
    "aria-autocomplete": "list",
    "aria-label": props.selectProps["aria-label"],
    "aria-labelledby": props.selectProps["aria-labelledby"],
  } as any;
  return (
    <MenuList {...props}>
      <Flex flexDirection={"column"} pos={"relative"}>
        {withBrowser && (
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
        )}
        {props?.children}
      </Flex>
    </MenuList>
  );
};

const CustomSelectControl = (props) => {
  const {
    onMenuOpen,
    value,
    selectLabel,
    placeholder,
    isLoading,
    isSmallView,
  } = props.selectProps;

  const label = value?.label;

  return (
    <Control {...props}>
      <EventFilterCard
        label={label}
        placeholder={placeholder}
        isLoading={isLoading}
        title={selectLabel}
        onClick={onMenuOpen}
        icon={<ChevronDown />}
        isSmallView={isSmallView}
      />
    </Control>
  );
};
