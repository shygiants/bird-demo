import React, { useState, useEffect } from 'react';
import {
    VStack,
    HStack,
    Heading,
    List,
    ListItem,
    Flex,
    Progress,
    Tooltip,
    Text,
    LinkBox,
    LinkOverlay,
} from '@chakra-ui/react';
import { ExternalLinkIcon, QuestionOutlineIcon } from '@chakra-ui/icons';

async function queryEBird(scientificName) {
    const eBirdQueryUrl = `https://api.ebird.org/v2/ref/taxon/find?locale=ko_KR&cat=species&key=jfekjedvescr&q=${scientificName}`;

    const resp = await fetch(eBirdQueryUrl);
    const results = await resp.json();

    if (results.length === 0) return null;

    const result = results[0];

    const match = result.name.match(
        /[\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff]/g
    );

    let koreanName = null;
    if (match !== null) {
        koreanName = result.name.split('-')[0].trim();
    }

    return { ...result, koreanName };
}

const googleSearchUrl = 'http://www.google.com/search?q=';
const allAboutBirdsUrl = 'https://www.allaboutbirds.org/news/search/?q=';

function Prediction({ className, latinName, confidence }) {
    const [url, setUrl] = useState();
    const [name, setName] = useState(className);

    useEffect(() => {
        queryEBird(latinName).then((result) => {
            if (result === null) return setUrl(allAboutBirdsUrl + latinName);

            if (result.koreanName !== null) setName(result.koreanName);

            const code = result.code;

            setUrl(`https://ebird.org/species/${code}`);
        });
    }, [className, latinName]);

    return (
        <Flex direction="column" gap={2}>
            <HStack justify="space-between">
                <LinkBox>
                    <Heading size="md" my="2">
                        <LinkOverlay isExternal href={url}>
                            {name}
                        </LinkOverlay>
                        <ExternalLinkIcon mx="2px" />
                    </Heading>
                    <Text>{latinName}</Text>
                </LinkBox>

                <Heading size="lg">
                    {`${(confidence * 100).toFixed(2)}%`}
                </Heading>
            </HStack>
            <Progress size="lg" value={confidence * 100} />
        </Flex>
    );
}

export default function ClassificationResults({ results }) {
    if (!results) return '';

    const help = (
        <VStack spacing={0} p="2" align="start">
            <HStack>
                <Heading size="md">이름</Heading>
                <Text>(한글명 미지원시, 영어명 표시)</Text>
            </HStack>

            <Text>학명</Text>
        </VStack>
    );

    return (
        <List spacing={4}>
            <Tooltip hasArrow label={help} fontSize="md" placement="right">
                <QuestionOutlineIcon />
            </Tooltip>
            {results.map(({ className, latinName, confidence }, idx) => (
                <ListItem key={idx}>
                    <Prediction {...{ className, latinName, confidence }} />
                </ListItem>
            ))}
        </List>
    );
}
