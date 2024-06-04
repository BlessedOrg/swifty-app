"use client";
import {
  Box,
  Card,
  Flex,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
  useMediaQuery,
} from "@chakra-ui/react";

export default function PrivacyPage() {
  const boxProps = {
    mt: 10,
  };
  const unorderedListProps = {
    pl: 5,
  };
  const linkProps = {
    color: "blue.500",
  };
  const h2Props = {
    fontSize: "1.7rem",
  };
  const h3Props = {
    fontSize: "1.2rem",
  };
  const flexColumnProps = {
    flexDirection: "column" as any,
    gap: 5,
  };

  const [isMobile] = useMediaQuery("(max-width: 768px)");

  return (

        <Box w={"100%"} display={"grid"} placeItems={"center"}>
          <Card py={"4rem"} px={"20px"} mt={{ base: "3rem", lg: "10rem" }} display={"flex"} maxW={"700px"}
                flexDirection={"column"} justifyContent={"center"} alignItems={"center"} mb={10}>
            <Heading as={"h1"}>Privacy</Heading>
            <Box width={"100%"} px={isMobile ? "1rem" : "3rem"}>
              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Heading {...h2Props}>
                    Terms and Privacy Policy
                  </Heading>
                  <Text>
                    This agreement (“Terms”) applies to your use of the Site. If you do not agree with the Terms, you can’t use the Site. If you use the Site, you agree to the Terms. We also have a Privacy Policy, and by using the Site you agree to that too. The most recent version of the Terms will always be available at blesses.fan/terms, and most recent version of the Privacy Policy will always be available at blessed.fan/privacy-policy. You can print and save if you want. The Terms and the Privacy Policy may change at any time. If there are changes, we will inform about it on and give a right to object. Changes to the Terms and Privacy Policy are in effect as soon as they are posted. The Site provides information on Pandr. The Pandr solution and documentation are subject to their own license agreements, which you must review and agree to before using them. If you do not agree to the changes, you must stop using the Site.
                  </Text>
                  <UnorderedList {...unorderedListProps} mb={4}>
                    <ListItem>
                      Alternative Dispute Resolution pursuant to Article 14 (1) ODR Regulation (EU) 524/2013 and § 36 VSBG: The European Commission provides a platform for online dispute resolution (OS), which you can find at http://ec.europa.eu/consumers/odr/. We are not obliged or willing to participate in a dispute resolution procedure before a consumer arbitration board.
                    </ListItem>
                  </UnorderedList>
                </Flex>
              </Box>

              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Heading {...h2Props}>
                    Code of conduct
                  </Heading>
                  <Text>
                    We may deny access to the Site or to the Pandr project for unacceptable behavior.
                  </Text>
                </Flex>
              </Box>

              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Heading {...h2Props}>
                    Liability
                  </Heading>
                  <Text>
                    The Site is provided “as-is”. We offer no express or implied warranty or condition of any kind, including warranties of merchantability, fitness for particular purpose, or non-infringement. We are not liable for loss or damage resulting from the use of the Site except as provided in this section, regardless of the legal ground. We are not responsible for the accuracy or completeness of information presented on the Site. Users of the Site agree to indemnify us from third party claims which may derive from their use contrary to the Terms. The indemnity includes costs of an adequate legal defense. In case of third party claims against us, users must provide the information necessary to assess and defend against the claims. We are liable for users’ damage arising from loss of life or injury to body or health based on our breach of a duty we owe you, for damages that arise where we have breached a duty that is of utmost importance for achieving the object of the contract, in cases of willful deceit, or for damages arising from the breach of a warranty assumed by us or from an organizational fault. Claims against us are time-barred after 12 months from the beginning of the statutory limitation period.
                  </Text>
                </Flex>
              </Box>

              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Heading {...h2Props}>
                    Legal
                  </Heading>
                  <Text>
                    The Terms are governed by the laws of Germany. The place of jurisdiction and fulfillment is Berlin. If any of the Terms are invalid or contain a gap, the other sections of the Terms remain in effect. If this happens, the parties are deemed to have made an agreement which comes closest to the intended economic consequences of the Terms.
                  </Text>
                </Flex>
              </Box>

              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Heading {...h2Props}>
                    Privacy Policy
                  </Heading>
                  <Text>
                    When you are using Pandr UG services and electronic media, we may collect, process and/or disclose data that identify you or make you identifiable (Personal Data) in accordance with this privacy policy (Policy). Further, we may either receive your Personal Data directly from you when you are sending emails to us or provide your Personal Data otherwise in the course of other interactions with us, or indirectly from third parties who legally provide your Personal Data to us. This Policy is meant to inform you, which Personal Data we collect, store, process, use and/or disclose, for which purposes and on which legal basis. We further inform you about your rights to protect your Personal Data. This Policy may be amended or updated from time to time to reflect changes in our practices with respect to the Processing of Personal Data, or changes in applicable law. We encourage you to read this Policy carefully, and to regularly check this page to review any changes we might make in accordance with the terms of this Policy. Your continued use of our Services or website constitutes your agreement to be bound by this Policy, as amended or updated from time to time. Please note that Pandr UG collects your Personal Data directly from the country where you are based and stores it on servers in the EU/EEA. We may process your data outside of the EU. Regardless of where we process it, we will always conform to EU level data privacy and data protection standards. If you have questions, write to us at gdpr@pandr.de.
                  </Text>
                </Flex>
              </Box>

              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Heading {...h2Props}>
                    Which Personal Data we process
                  </Heading>
                  <UnorderedList {...unorderedListProps} mb={4}>
                    <ListItem>
                      Personal details: name
                    </ListItem>
                    <ListItem>
                      Contact details: email address
                    </ListItem>
                    <ListItem>
                      Technical information (e.g., Device type, IP address, Public Key)
                    </ListItem>
                  </UnorderedList>
                </Flex>
              </Box>

              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Heading {...h2Props}>
                    How we collect your Personal Data
                  </Heading>
                  <UnorderedList {...unorderedListProps} mb={4}>
                    <ListItem>
                      When you contact us via e-mail, telephone, or by any other means of contact;
                    </ListItem>
                    <ListItem>
                      When we provide you with access to our apps (e.g., when you register as a user);
                    </ListItem>
                    <ListItem>
                      Where you have chosen to make such Personal Data public, including via social media profiles;
                    </ListItem>
                    <ListItem>
                      When you visit our websites or use any features on, or through, our websites;
                    </ListItem>
                    <ListItem>
                      When you visit our website, your device and browser may automatically disclose certain information (such as device type, operating system, browser type, browser settings, IP address, language settings, dates and times of connecting to a website, and other technical communications information), some of which may constitute Personal Data;
                    </ListItem>
                    <ListItem>
                      When you submit your resume/CV to us for a job application;
                    </ListItem>
                    <ListItem>
                      When you give your business card and allow us to contact you.
                    </ListItem>
                  </UnorderedList>
                </Flex>
              </Box>

              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Heading {...h2Props}>
                    Creation of Personal Data
                  </Heading>
                  <Text>
                    In the course of your interaction with Pandr UG and its products, we may also create Personal Data about you, such as records of your interactions with us and details of your transaction history.
                  </Text>
                </Flex>
              </Box>

              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Heading {...h2Props}>
                    For which purposes we use your Personal Data
                  </Heading>
                  <Text>
                    We use your Personal Data to provide, maintain, and improve our services, to grant you access to our apps, and to enable you the use of our product and the respective platform. For marketing purposes, we use your Personal Data only if and as long as we have received your explicit prior consent and in accordance with the respectively applicable additional legal requirements in your jurisdiction.
                  </Text>
                  <Text>
                    We do not sell your Personal Data to third parties. In addition, you acknowledge that the purpose of our service is to provide information about our product and any company news. If you submit Personal Data to us for the purpose of being informed, you consent to our collection, processing, use, and disclosure of such personal data for the purposes of communication.
                  </Text>
                </Flex>
              </Box>

              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Heading {...h2Props}>
                    Lawful basis for Processing Personal Data
                  </Heading>
                  <Text>
                    In Processing your Personal Data in connection with the purposes set out in this Policy, we may rely on one or more of the following legal bases, depending on the circumstances:
                  </Text>
                  <UnorderedList {...unorderedListProps} mb={4}>
                    <ListItem>
                      We have obtained your explicit prior consent to the Processing (this legal basis is only used in relation to Processing that is entirely voluntary – it is not used for Processing that is necessary or obligatory in any way);
                    </ListItem>
                    <ListItem>
                      The Processing is necessary in connection with any contractual relationship that you may enter into with us;
                    </ListItem>
                    <ListItem>
                      The Processing is required by applicable law;
                    </ListItem>
                    <ListItem>
                      The Processing is necessary to protect the vital interests of any individual; or
                    </ListItem>
                    <ListItem>
                      We have a legitimate interest in carrying out the Processing for the purpose of managing, operating, or promoting our business, and that legitimate interest is not overridden by your interests, fundamental rights, or freedoms.
                    </ListItem>
                  </UnorderedList>
                  <Text>
                    When we are involving third-party Processors in the performance of our services and contractual obligations and such involvement requires the sharing of Personal Data, we have entered with our third-party Processors into data processing agreements according to Art. 28 of the European General Data Protection Regulation (“GDPR”) and, as far as required, further appropriate safeguards according to Art. 46 – 49 GDPR. The list of third-party Processors to which we disclose your Personal Data can be requested by e-mail to gdpr@pandr.de.
                  </Text>
                  <Text>
                    Specifically, we can already name the following Data Processors:
                  </Text>
                  <UnorderedList {...unorderedListProps} mb={4}>
                    <ListItem>
                      Hubspot: To store your personal and company data, we are working together with “Hubspot", a customer relationship and marketing solution provided by Hubspot, Inc., located in the United States. Your data will be stored in a data center within the European Union (EU). For more information, please see Hubspot's Privacy Policy.
                    </ListItem>
                    <ListItem>
                      Typeform: When you use our contact form or participate in a questionnaire, we are working together with “Typeform”, a service provided by Typeform Inc., located in Barcelona. For more information, please see Typeform's Privacy Policy.
                    </ListItem>
                    <ListItem>
                      Slack: To store your personal data that comes from questionnaires of "Typeform" or "Hubspot", we are working together with “Slack”, a service provided by Slack Technologies Limited, located in Dublin. For more information, please see Slack's Privacy Policy.
                    </ListItem>
                    <ListItem>
                      AWS: To store your personal data and decentralized stored media assets, we are working together with “AWS” as a storage service provided by our data processor Amazon, located in a data center in Europe. For more information, please see Amazon’s Privacy Policy.
                    </ListItem>
                  </UnorderedList>
                </Flex>
              </Box>

              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Heading {...h2Props}>
                    Processing your Sensitive Personal Data
                  </Heading>
                  <Text>
                    We do not seek to collect or Process your Sensitive Personal Data, except where:
                  </Text>
                  <UnorderedList {...unorderedListProps} mb={4}>
                    <ListItem>
                      The Processing is required or permitted by applicable law
                    </ListItem>
                    <ListItem>
                      The Processing is necessary for the detection or prevention of crime (including the prevention of fraud);
                    </ListItem>
                    <ListItem>
                      The Processing is necessary for the establishment, exercise, or defense of legal rights; or
                    </ListItem>
                    <ListItem>
                      We have obtained your explicit consent prior to Processing your Sensitive Personal Data (as above, this legal basis is only used in relation to Processing that is entirely voluntary – it is not used for Processing that is necessary or obligatory in any way).
                    </ListItem>
                  </UnorderedList>
                </Flex>
              </Box>

              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Heading {...h2Props}>
                    Consent and withdrawal
                  </Heading>
                  <Text>
                    Any consent is provided freely. If you give your consent, you have the right to withdraw your consent at any time. The withdrawal of consent does not affect the lawfulness of Processing based on consent before its withdrawal. After your withdrawal, we will stop to Process your Personal Data, including storage. This paragraph is only relevant for Processing that is entirely voluntary – it does not apply to Processing that is necessary or obligatory in any way. To withdraw your consent, click the unsubscribe button on any newsletter you receive from us.
                  </Text>
                </Flex>
              </Box>

              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Heading {...h2Props}>
                    Cookies
                  </Heading>
                  <Text>
                    This website uses Hubspot. Hubspot uses cookies to personalize content and ads, offer social media features, and analyze traffic to our website. Hubspot uses cookies, including to recognize the visitor’s browser when they return to the website or to set a unique ID for the session. This allows the website to obtain data about visitor behavior for statistical purposes. For more information about Hubspot's use of data, please see Hubspot's Privacy Policy.
                  </Text>
                </Flex>
              </Box>

              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Heading {...h2Props}>
                    Marketing Activities
                  </Heading>
                  <Text>
                    We may share your Personal Data to our business partners that would use our solution to run their events.
                  </Text>
                </Flex>
              </Box>

              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Heading {...h2Props}>
                    Links to Business Partner and Co-Branded Sites
                  </Heading>
                  <Text>
                    Certain links contained on the Pandr UG web sites may direct you to companies with which Pandr UG has established business relationships. When you submit information to one of these co-branded sites or partner companies, you may be submitting it to both Pandr UG and these business partners. Under no circumstances may Pandr UG be held responsible for the privacy practices of these business partners and we therefore strongly encourage you to read their respective privacy policies as they may differ from ours.
                  </Text>
                </Flex>
              </Box>

              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Heading {...h2Props}>
                    Your rights related to data privacy
                  </Heading>
                  <Text>
                    You have the right to request access to and rectification or erasure of your Personal Data, or restriction of their Processing. Furthermore, you have the right to object to Processing as well as to request data portability. If you are in the EU, you have the right to file a complaint to the responsible European Data Protection Authority.
                  </Text>
                </Flex>
              </Box>

              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Heading {...h2Props}>
                    Our contact information, Data Controller
                  </Heading>
                  <Text>
                    If you have a direct business relationship with us, we are a Data Controller according to Art. 4 para. 7 GDPR. For any requests, you can contact us as follows:
                  </Text>
                  <UnorderedList {...unorderedListProps} mb={4}>
                    <ListItem>
                      Pandr UG
                    </ListItem>
                    <ListItem>
                      Erich-Weinert-Str.51
                    </ListItem>
                    <ListItem>
                      10439 Berlin
                    </ListItem>
                    <ListItem>
                      <Link href={"gdpr@pandr.de"}>gdpr@pandr.de</Link>
                    </ListItem>
                  </UnorderedList>
                </Flex>
              </Box>

              <Box {...boxProps}>
                <Flex {...flexColumnProps}>
                  <Heading {...h2Props}>
                    Definitions
                  </Heading>
                  <UnorderedList {...unorderedListProps} mb={4}>
                    <ListItem>
                      Controller means the entity that decides how and why Personal Data is Processed. In many jurisdictions, the Controller has primary responsibility for complying with applicable data protection laws.
                    </ListItem>
                    <ListItem>
                      Data Protection Authority means an independent public authority that is legally tasked with overseeing compliance with applicable data protection laws.
                    </ListItem>
                    <ListItem>
                      EEA means the European Economic Area.
                    </ListItem>
                    <ListItem>
                      Personal Data means information that is about any individual, or from which any individual is identifiable. Examples of Personal Data that we may Process are provided above in this Policy.
                    </ListItem>
                    <ListItem>
                      Process, Processing or Processed means anything that is done with any Personal Data, whether or not by automated means, such as collection, recording, organization, structuring, storage, adaptation or alteration, retrieval, consultation, use, disclosure by transmission, dissemination or otherwise making available, alignment or combination, restriction, erasure, or destruction.
                    </ListItem>
                  </UnorderedList>
                </Flex>
              </Box>
            </Box>
          </Card>
        </Box>
 
  );
}
