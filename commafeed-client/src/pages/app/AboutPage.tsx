import { t, Trans } from "@lingui/macro"
import { Anchor, Box, Center, Code, Container, createStyles, List, NativeSelect, SimpleGrid, Title } from "@mantine/core"
import { Constants } from "app/constants"
import { redirectToApiDocumentation } from "app/slices/redirect"
import { useAppDispatch, useAppSelector } from "app/store"
import { CategorySelect } from "components/content/add/CategorySelect"
import { KeyboardShortcutsHelp } from "components/KeyboardShortcutsHelp"
import React, { useState } from "react"
import { TbHelp, TbKeyboard, TbPuzzle, TbRocket } from "react-icons/tb"

const useStyles = createStyles(() => ({
    sectionTitle: {
        display: "flex",
        alignItems: "center",
    },
}))

function Section(props: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    const { classes } = useStyles()
    return (
        <Box my="xl">
            <Box className={classes.sectionTitle} mb="xs">
                {props.icon}
                <Title order={3} ml="xs">
                    {props.title}
                </Title>
            </Box>
            <Box>{props.children}</Box>
        </Box>
    )
}

function NextUnreadBookmarklet() {
    const [categoryId, setCategoryId] = useState(Constants.categories.all.id)
    const [order, setOrder] = useState("desc")
    const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf("#"))
    const href = `javascript:window.location.href='${baseUrl}next?category=${categoryId}&order=${order}&t='+new Date().getTime();`

    return (
        <Box>
            <CategorySelect value={categoryId} onChange={c => c && setCategoryId(c)} withAll description={t`Category`} />
            <NativeSelect
                data={[
                    { value: "desc", label: t`Newest first` },
                    { value: "asc", label: t`Oldest first` },
                ]}
                value={order}
                onChange={e => setOrder(e.target.value)}
                description={t`Order`}
            />
            <Trans>Drag link to bookmark bar</Trans>
            <span> </span>
            <Anchor href={href} target="_blank" rel="noreferrer">
                <Trans>CommaFeed next unread item</Trans>
            </Anchor>
        </Box>
    )
}

const bitcoinAddress = <Code>{Constants.bitcoinWalletAddress}</Code>
export function AboutPage() {
    const version = useAppSelector(state => state.server.serverInfos?.version)
    const revision = useAppSelector(state => state.server.serverInfos?.gitCommit)
    const dispatch = useAppDispatch()
    return (
        <Container size="xl">
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: Constants.layout.mobileBreakpoint, cols: 1 }]}>
                <Section title={t`About`} icon={<TbHelp size={24} />}>
                    <Box>
                        <Trans>
                            CommaFeed version {version} ({revision})
                        </Trans>
                    </Box>
                    <Box mt="md">
                        <Trans>
                            CommaFeed is an open-source project. Sources are hosted on&nbsp;
                            <Anchor href="https://github.com/Athou/commafeed" target="_blank" rel="noreferrer">
                                GitHub
                            </Anchor>
                            .
                        </Trans>
                    </Box>
                    <Box>
                        <Trans>If you encounter an issue, please report it on the issues page of the GitHub project.</Trans>
                    </Box>

                    <Box mt="md">
                        <Trans>
                            If you like this project, please consider a donation to support the developer and help cover the costs of
                            keeping this website online.
                        </Trans>

                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                            <input type="hidden" name="cmd" value="_donations" />
                            <input type="hidden" name="business" value="9CNQHMJG2ZJVY" />
                            <input type="hidden" name="lc" value="US" />
                            <input type="hidden" name="item_name" value="CommaFeed" />
                            <input type="hidden" name="bn" value="PP-DonationsBF:btn_donateCC_LG.gif:NonHosted" />
                            <input type="hidden" name="currency_code" value="USD" />
                            <Center mt="md">
                                <Box mr="md">
                                    <input
                                        type="image"
                                        src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
                                        name="submit"
                                        alt="PayPal - The safer, easier way to pay online!"
                                    />
                                </Box>
                                <Box>
                                    <select name="currency_code">
                                        <option value="EUR">Euro</option>
                                        <option value="USD">US Dollars</option>
                                    </select>
                                </Box>
                            </Center>
                        </form>
                    </Box>
                    <Box mt="xs">
                        <Trans>For those of you who prefer bitcoin, here is the address: {bitcoinAddress}</Trans>
                    </Box>
                </Section>
                <Section title={t`Goodies`} icon={<TbPuzzle size={24} />}>
                    <List>
                        <List.Item>
                            <Trans>Browser extentions</Trans>
                            <List withPadding>
                                <List.Item>
                                    <Anchor
                                        href="https://addons.mozilla.org/en-US/firefox/addon/commafeed/"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Firefox
                                    </Anchor>
                                </List.Item>
                                <List.Item>
                                    <Anchor href="https://github.com/Athou/commafeed-chrome" target="_blank" rel="noreferrer">
                                        Chrome
                                    </Anchor>
                                </List.Item>
                                <List.Item>
                                    <Anchor href="https://github.com/Athou/commafeed-opera" target="_blank" rel="noreferrer">
                                        Opera
                                    </Anchor>
                                </List.Item>
                            </List>
                        </List.Item>
                        <List.Item>
                            <Trans>Subscribe URL</Trans>
                            <span> </span>
                            <Anchor href="rest/feed/subscribe?url=FEED_URL_HERE" target="_blank" rel="noreferrer">
                                rest/feed/subscribe?url=FEED_URL_HERE
                            </Anchor>
                        </List.Item>
                        <List.Item>
                            <Trans>Next unread item bookmarklet</Trans>
                            <span> </span>
                            <Box ml="xl">
                                <NextUnreadBookmarklet />
                            </Box>
                        </List.Item>
                    </List>
                </Section>
                <Section title={t`Keyboard shortcuts`} icon={<TbKeyboard size={24} />}>
                    <KeyboardShortcutsHelp />
                </Section>
                <Section title={t`REST API`} icon={<TbRocket size={24} />}>
                    <Anchor onClick={() => dispatch(redirectToApiDocumentation())}>
                        <Trans>Go to the API documentation.</Trans>
                    </Anchor>
                </Section>
            </SimpleGrid>
        </Container>
    )
}