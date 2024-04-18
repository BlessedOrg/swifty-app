"use client";
import { useEffect, useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import { components } from "react-select";
import { Flex, Input, Text } from "@chakra-ui/react";
import { MapPin } from "lucide-react";
const { Option, Control, MenuList } = components;
import { OpenStreetMapProvider } from "leaflet-geosearch";

export default function LocationSelect({ setCoordinates, handleCoords }) {
  const selectRef = useRef(null) as any;
  const menuRef = useRef(null) as any;
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = (v?: boolean) => {
    if (typeof v === "boolean") {
      setIsOpen(v);
    } else {
      setIsOpen(!isOpen);
    }
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
  const handleAddressChange = async (selectedOption) => {
    handleCoords(selectedOption);
    setSelectedAddress(selectedOption);
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: selectedOption.label });
    if (results.length > 0) {
      const { x, y } = results[0];
      setCoordinates([y, x]);
    }
  };

  const handleInputChange = async (
    inputValue: string,
    callback: any,
  ): Promise<any> => {
    if (!inputValue) {
      callback([]);
      return;
    }

    const provider = new OpenStreetMapProvider();
    try {
      const results = await provider.search({ query: inputValue });

      const options = results.map((result) => ({
        value: {
          label: result.label,
          x: result.x,
          y: result.y,
        },
        label: result.label,
      }));
      callback(options);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };
  return (
    <div ref={menuRef} style={{ width: "inherit" }}>
      <AsyncSelect
        ref={selectRef}
        menuIsOpen={isOpen}
        onMenuOpen={toggleMenu}
        onMenuClose={toggleMenu}
        options={[]}
        onChange={handleAddressChange}
        loadOptions={handleInputChange}
        value={selectedAddress}
        placeholder="Search address"
        closeMenuOnSelect={true}
        components={{
          Control: CustomSelectControl,
          Option: CustomOption,
          MenuList: CustomMenuList,
        }}
        styles={{
          container: (prev) => ({
            ...prev,
            width: "100%",
          }),
          menu: (prev) => ({
            ...prev,
            zIndex: 100,
            marginTop: 0,
            borderRadius: 0,
            borderTop: "none",
          }),
          control: (prev) => ({
            ...prev,
            textAlign: "left",
            background: "#ECEDEF",
            border: "none",
          }),
          option: () => ({}),
        }}
      />
    </div>
  );
}
const CustomSelectControl = (props) => {
  const { onMenuOpen, value } = props.selectProps;
  return (
    <Control {...props}>
      <Flex
        as={"button"}
        type={"button"}
        onClick={onMenuOpen}
        w={"100%"}
        p={"8px"}
        rounded={"7px"}
        gap={2}
        alignItems={"center"}
        bg={"#ECEDEF"}
        h={"100%"}
      >
        <MapPin size={20} style={{ minWidth: "20px" }} />
        <Text
          fontWeight={500}
          color={"#0D151CA3"}
          whiteSpace={"nowrap"}
          overflow={"hidden"}
          textOverflow={"ellipsis"}
        >
          {!!value?.label ? value.label : "Add Event Location"}
        </Text>
      </Flex>
    </Control>
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
            onChange={(e) => {
              onInputChange(e.currentTarget.value, {
                action: "input-change",
              });
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.currentTarget.focus();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              e.currentTarget.focus();
            }}
            onFocus={onMenuInputFocus}
            _active={{}}
            _focusVisible={{}}
            _focus={{}}
            {...ariaAttributes}
          />
        </Flex>
        {props?.children}
      </Flex>
    </MenuList>
  );
};
