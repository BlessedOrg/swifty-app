'use client'
// Chakra imports
import {Flex, Stat, StatLabel, StatNumber, useColorModeValue, Text, Skeleton} from '@chakra-ui/react';
import Card from "./Card";
// Custom components

export default function Default(props: {
	startContent?: JSX.Element;
	endContent?: JSX.Element;
	name: string;
	growth?: string | number;
	value?: string | number | null;
	symbol?: string;
	isLoading?: boolean
	color?: string
}) {
	const { startContent,color, endContent, isLoading, symbol="", name, growth, value } = props;
	const textColor = !!color ? color :useColorModeValue('secondaryGray.900', 'white');
	const textColorSecondary = 'secondaryGray.600';

	return (
		<Card py='15px'>
			<Flex my='auto' h='100%' align={{ base: 'center', xl: 'start' }} justify={{ base: 'center', xl: 'center' }}>
				{startContent}

				<Stat my='auto' ms={startContent ? '18px' : '0px'}>
					<StatLabel
						lineHeight='100%'
						color={textColorSecondary}
						fontSize={{
							base: 'sm'
						}}>
						{name}
					</StatLabel>
					<StatNumber
						color={textColor}
						fontSize={{
							base: '2xl'
						}}>
						{!isLoading ? `${value}${symbol}` : <Skeleton height='20px' mt={2} rounded={'7px'}/>}
					</StatNumber>
					{growth ? (
						<Flex align='center'>
							<Text color='green.500' fontSize='xs' fontWeight='700' me='5px'>
								{growth}
							</Text>
							<Text color='secondaryGray.600' fontSize='xs' fontWeight='400'>
								since last month
							</Text>
						</Flex>
					) : null}
				</Stat>
				<Flex ms='auto' w='max-content'>
					{endContent}
				</Flex>
			</Flex>
		</Card>
	);
}
