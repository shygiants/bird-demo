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

async function getEBirdUrl({ className, latinName }) {
    const allAboutBirdsUrl = 'https://www.allaboutbirds.org/news/search/?q=';
    const googleSearchUrl = 'http://www.google.com/search?q=';
    const eBirdQueryUrl = `https://api.ebird.org/v2/ref/taxon/find?cat=species&key=jfekjedvescr&q=${latinName}`;

    const resp = await fetch(eBirdQueryUrl);
    const results = await resp.json();

    if (results.length === 0) {
        return allAboutBirdsUrl + latinName;
    }

    const code = results[0].code;

    return `https://ebird.org/species/${code}`;
}

function Prediction({ className, latinName, confidence }) {
    const [url, setUrl] = useState();

    useEffect(() => {
        getEBirdUrl({ className, latinName }).then(setUrl);
    }, [className, latinName]);

    return (
        <Flex direction="column" gap={2}>
            <HStack justify="space-between">
                <LinkBox>
                    <Heading size="md" my="2">
                        <LinkOverlay isExternal href={url}>
                            {className}
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
            <Heading size="md">이름</Heading>
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
