import { t, Trans } from "@lingui/macro"
import { Box, Divider, Group, Menu, SegmentedControl, SegmentedControlItem, useMantineColorScheme } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { client } from "app/client"
import { redirectToAbout, redirectToAdminUsers, redirectToMetrics, redirectToSettings } from "app/slices/redirect"
import { changeViewMode } from "app/slices/user"
import { useAppDispatch, useAppSelector } from "app/store"
import { ViewMode } from "app/types"
import { useState } from "react"
import {
    TbChartLine,
    TbHelp,
    TbLayoutList,
    TbList,
    TbMoon,
    TbNotes,
    TbPower,
    TbSettings,
    TbSun,
    TbUsers,
    TbWorldDownload,
} from "react-icons/tb"

interface ProfileMenuProps {
    control: React.ReactElement
}

interface ViewModeControlItem extends SegmentedControlItem {
    value: ViewMode
}

const iconSize = 16

const viewModeData: ViewModeControlItem[] = [
    {
        value: "title",
        label: (
            <Group>
                <TbList size={iconSize} />
                <Box ml={6}>
                    <Trans>Compact</Trans>
                </Box>
            </Group>
        ),
    },
    {
        value: "cozy",
        label: (
            <Group>
                <TbLayoutList size={iconSize} />
                <Box ml={6}>
                    <Trans>Cozy</Trans>
                </Box>
            </Group>
        ),
    },
    {
        value: "expanded",
        label: (
            <Group>
                <TbNotes size={iconSize} />
                <Box ml={6}>
                    <Trans>Expanded</Trans>
                </Box>
            </Group>
        ),
    },
]

export function ProfileMenu(props: ProfileMenuProps) {
    const [opened, setOpened] = useState(false)
    const viewMode = useAppSelector(state => state.user.settings?.viewMode)
    const profile = useAppSelector(state => state.user.profile)
    const admin = useAppSelector(state => state.user.profile?.admin)
    const dispatch = useAppDispatch()
    const { colorScheme, toggleColorScheme } = useMantineColorScheme()
    const dark = colorScheme === "dark"

    const logout = () => {
        window.location.href = "logout"
    }

    return (
        <Menu position="bottom-end" closeOnItemClick={false} opened={opened} onChange={setOpened}>
            <Menu.Target>{props.control}</Menu.Target>
            <Menu.Dropdown>
                {profile && <Menu.Label>{profile.name}</Menu.Label>}
                <Menu.Item
                    icon={<TbSettings size={iconSize} />}
                    onClick={() => {
                        dispatch(redirectToSettings())
                        setOpened(false)
                    }}
                >
                    <Trans>Settings</Trans>
                </Menu.Item>
                <Menu.Item
                    icon={<TbWorldDownload size={iconSize} />}
                    onClick={() =>
                        client.feed.refreshAll().then(() => {
                            showNotification({
                                message: t`Your feeds have been queued for refresh.`,
                                color: "green",
                                autoClose: 1000,
                            })
                            setOpened(false)
                        })
                    }
                >
                    <Trans>Fetch all my feeds now</Trans>
                </Menu.Item>

                <Divider />
                <Menu.Label>
                    <Trans>Theme</Trans>
                </Menu.Label>
                <Menu.Item icon={dark ? <TbSun size={iconSize} /> : <TbMoon size={iconSize} />} onClick={() => toggleColorScheme()}>
                    {dark ? <Trans>Switch to light theme</Trans> : <Trans>Switch to dark theme</Trans>}
                </Menu.Item>

                <Divider />
                <Menu.Label>
                    <Trans>Display</Trans>
                </Menu.Label>
                <SegmentedControl
                    fullWidth
                    orientation="vertical"
                    data={viewModeData}
                    value={viewMode}
                    onChange={e => dispatch(changeViewMode(e as ViewMode))}
                    mb="xs"
                />

                {admin && (
                    <>
                        <Divider />
                        <Menu.Label>
                            <Trans>Admin</Trans>
                        </Menu.Label>
                        <Menu.Item
                            icon={<TbUsers size={iconSize} />}
                            onClick={() => {
                                dispatch(redirectToAdminUsers())
                                setOpened(false)
                            }}
                        >
                            <Trans>Manage users</Trans>
                        </Menu.Item>
                        <Menu.Item
                            icon={<TbChartLine size={iconSize} />}
                            onClick={() => {
                                dispatch(redirectToMetrics())
                                setOpened(false)
                            }}
                        >
                            <Trans>Metrics</Trans>
                        </Menu.Item>
                    </>
                )}

                <Divider />
                <Menu.Item
                    icon={<TbHelp size={iconSize} />}
                    onClick={() => {
                        dispatch(redirectToAbout())
                        setOpened(false)
                    }}
                >
                    <Trans>About</Trans>
                </Menu.Item>
                <Menu.Item icon={<TbPower size={iconSize} />} onClick={logout}>
                    <Trans>Logout</Trans>
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}