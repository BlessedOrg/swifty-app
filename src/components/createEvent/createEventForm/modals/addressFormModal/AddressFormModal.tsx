import {
  Button,
  Flex,
  FormErrorMessage,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Binary, Building2, Construction, Globe, MapPin } from "lucide-react";
import {
  FormField,
  FormInput,
} from "@/components/createEvent/createEventForm/FormFields";
import { Controller, useForm, UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Country, State, City } from "country-state-city";
import { useEffect, useMemo, useRef, useState } from "react";
import { LocationSelect } from "@/components/createEvent/createEventForm/locationSelect/LocationSelect";
import { addressSchema } from "@/components/createEvent/createEventForm/modals/addressFormModal/schema";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  register: any;
  errors: any;
  setValue: UseFormSetValue<any>;
  defaultValues: any;
  control: any;
}

export const AddressFormModal = ({
  isOpen,
  onClose,
  setValue,
  defaultValues = {},
}: IProps) => {
  const [stateIsRequired, setStateIsRequired] = useState(true);
  const [countryValue, setCountryValue] = useState(null);
  const [stateValue, setStateValue] = useState(null);
  const [cityValue, setCityValue] = useState(null);

  const methods = useForm({
    resolver: zodResolver(addressSchema(stateIsRequired)),
    defaultValues,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    control,
    setValue: setLocaleValue,
  } = methods;
  const countryRef = useRef(null) as any;
  const watchCountryCode = watch("countryCode");
  const watchStateCode = watch("stateCode");

  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(
    () =>
      !!watchCountryCode ? State.getStatesOfCountry(watchCountryCode) : [],
    [watchCountryCode],
  );
  const cities = useMemo(() => {
    if (!!watchCountryCode && !states.length) {
      return City.getCitiesOfCountry(watchCountryCode) || [];
    } else {
      return !!watchStateCode
        ? City.getCitiesOfState(watchCountryCode, watchStateCode)
        : [{ name: "City", isoCode: "city" }];
    }
  }, [watchCountryCode, watchStateCode]);

  const countriesOptions = countries.map((item) => ({
    label: item.name,
    value: item.isoCode,
    flag: item.flag,
    continent: item.timezones?.[0]?.zoneName?.split("/")?.[0] || "Others",
    countryFlag: item.flag,
    countryLatitude: item.latitude,
    countryLongitude: item.longitude,
  }));
  const statesOptions = states.map((item) => ({
    label: item.name,
    value: item.isoCode,
  }));
  const citiesOptions = cities.map((item) => ({
    label: item.name,
    value: item.isoCode,
    cityLatitude: item.latitude,
    cityLongitude: item.longitude,
  }));

  const onSubmit = (data) => {
    const { countryAndCityDetails, ...rest } = data;
    setValue("address", {
      ...rest,
      ...countryAndCityDetails,
    });

    onClose();
  };
  useEffect(() => {
    const v = getValues();
  }, [watchStateCode, watchStateCode, watchCountryCode]);

  const onCountryValueChange = (option, field) => {
    field.onChange(option.label);
    setCountryValue(option);
    setLocaleValue("countryCode", option.value);
    setLocaleValue("city", "");
    setLocaleValue("stateCode", "");
    setLocaleValue("continent", option.continent);
    setLocaleValue(
      "countryAndCityDetails.countryLatitude",
      option.countryLatitude,
    );
    setLocaleValue(
      "countryAndCityDetails.countryLongitude",
      option.countryLongitude,
    );
    setLocaleValue("countryAndCityDetails.countryFlag", option.countryFlag);

    setCityValue(null);
    setStateValue(null);
  };
  const onStateValueChange = (option, field) => {
    field.onChange(option.value);
    setLocaleValue("city", "");
    setStateValue(option);
    setCityValue(null);
  };
  const onCityValueChange = (option, field) => {
    field.onChange(option.label);
    setLocaleValue("countryAndCityDetails.cityLatitude", option.cityLatitude);
    setLocaleValue("countryAndCityDetails.cityLongitude", option.cityLongitude);

    setCityValue(option);
  };

  const locationWithoutStatesAndCities =
    (!!watchCountryCode && !states.length && !citiesOptions.length) ||
    (!!watchCountryCode && !!states.length && !citiesOptions.length);

  useEffect(() => {
    if (locationWithoutStatesAndCities && stateIsRequired) {
      setStateIsRequired(false);
    } else if (!stateIsRequired && !locationWithoutStatesAndCities) {
      setStateIsRequired(true);
    }
  }, [locationWithoutStatesAndCities]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Event location</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex gap={4} flexDirection={"column"}>
              <Flex gap={4} ref={countryRef}>
                <FormField
                  label={"Country*"}
                  isInvalid={!!errors?.country}
                  errorMessage={
                    <FormErrorMessage>{`${errors?.country?.message}`}</FormErrorMessage>
                  }
                >
                  <Controller
                    render={({ field }) => (
                      <LocationSelect
                        options={countriesOptions}
                        placeholder={"Country"}
                        icon={<Globe size={20} />}
                        onChange={(e) => {
                          onCountryValueChange(e, field);
                        }}
                        isDisabled={false}
                        value={countryValue}
                      />
                    )}
                    name={"country"}
                    control={control}
                  />
                </FormField>
                <FormField
                  label={`State${stateIsRequired ? "*" : ""}`}
                  isInvalid={!!errors?.stateCode}
                  isDisabled={!watchCountryCode}
                  errorMessage={
                    <FormErrorMessage>{`${errors?.stateCode?.message}`}</FormErrorMessage>
                  }
                >
                  <Controller
                    render={({ field }) => (
                      <LocationSelect
                        options={statesOptions}
                        placeholder={"State"}
                        icon={<Building2 size={20} />}
                        onChange={(e) => {
                          onStateValueChange(e, field);
                        }}
                        isDisabled={!watchCountryCode}
                        value={stateValue}
                      />
                    )}
                    name={"stateCode"}
                    control={control}
                  />
                </FormField>
              </Flex>
              <FormField
                label={"City*"}
                isInvalid={!!errors?.city}
                isDisabled={
                  !watchCountryCode || (!watchStateCode && !!states.length)
                }
                errorMessage={
                  <FormErrorMessage>{`${errors?.city?.message}`}</FormErrorMessage>
                }
              >
                {locationWithoutStatesAndCities ? (
                  <FormInput
                    icon={Building2}
                    id={"city"}
                    placeholder={"City"}
                    register={register}
                  />
                ) : (
                  <Controller
                    render={({ field }) => (
                      <LocationSelect
                        options={citiesOptions}
                        placeholder={"City"}
                        icon={<Building2 size={20} />}
                        onChange={(e) => {
                          onCityValueChange(e, field);
                        }}
                        isDisabled={
                          !watchCountryCode ||
                          (!watchStateCode && !!states.length)
                        }
                        value={cityValue}
                      />
                    )}
                    name={"city"}
                    control={control}
                  />
                )}
              </FormField>
              <Flex gap={4}>
                <FormField
                  label={"Street 1st line*"}
                  isInvalid={!!errors?.street1stLine}
                  errorMessage={
                    <FormErrorMessage>{`${errors?.street1stLine?.message}`}</FormErrorMessage>
                  }
                >
                  <FormInput
                    icon={Construction}
                    id={"street1stLine"}
                    placeholder={"Street 1st line"}
                    register={register}
                  />
                </FormField>
                <FormField label={"Street 2nd line"}>
                  <FormInput
                    id={"street2ndLine"}
                    placeholder={"Street 2nd line"}
                    register={register}
                  />
                </FormField>
              </Flex>
              <FormField
                label={"Postal Code*"}
                isInvalid={!!errors?.postalCode}
                errorMessage={
                  <FormErrorMessage>{`${errors?.postalCode?.message}`}</FormErrorMessage>
                }
              >
                <FormInput
                  icon={Binary}
                  type={"number"}
                  id={"postalCode"}
                  placeholder={"Postal Code e.g., 123321"}
                  register={register}
                />
              </FormField>
              <FormField label={"Location details (optional)"}>
                <FormInput
                  icon={MapPin}
                  id={"locationDetails"}
                  placeholder={"Location details e.g., Conference House"}
                  register={register}
                />
              </FormField>
            </Flex>

            <ModalFooter mt={6}>
              <Button variant="ghost" type={"submit"}>
                Save address
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
