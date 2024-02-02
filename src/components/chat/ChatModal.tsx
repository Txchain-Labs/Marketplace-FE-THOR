import * as React from 'react';
import { Channel as ChannelType, StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelList,
  ChannelListProps,
  ChannelHeader,
  MessageList,
  // MessageCommerce,
  MessageInput,
  Thread,
  Window,
  StreamMessage,
  // Avatar,
  // SuggestionItemProps,
  // SuggestionUser,
  // SuggestionCommand,
  SuggestionListHeaderProps,
} from 'stream-chat-react';
import '@stream-io/stream-chat-css/dist/css/index.css';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {
  Container,
  Typography,
  Button,
  Tabs,
  TabsProps,
  Tab,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import 'react-alice-carousel/lib/alice-carousel.css';
import { palette } from '../../theme/palette';
import { useSelector } from 'react-redux';
import { AuthService } from '../../services/auth.service';
import MessagingChannelPreview from './MessagingChannelPreview/MessagingChannelPreview';
import type { MouseEventHandler } from 'react';
import CreateChannel from './CreateChannel/CreateChannel';
import { useMobileView } from '../../hooks/useMobileView';

// type BaseEmoji = any;
export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
  channelListOptions: {
    filters: ChannelListProps['filters'];
    sort: ChannelListProps['sort'];
    options: ChannelListProps['options'];
  };
  onPreviewSelect?: MouseEventHandler;
  // unreadTotalCount: number;
  setUnreadTotalCount: (a: number) => void;
}

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))<TabsProps>({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    top: '25px',
  },
  '& .MuiTabs-indicatorSpan': {
    minWidth: 40,
    width: 'auto',
    backgroundColor: palette.primary.fire,
  },
  '& .MuiButtonBase-root.MuiTab-root': {
    color: '#808080!important',
    marginBottom: 0,
    fontFamily: 'Nexa-Bold',
    fontSize: '14px',
    lineHeight: '17px',
    letterSpacing: '0em',
    textAlign: 'left',
  },
  '& .MuiButtonBase-root.MuiTab-root.Mui-selected': {
    color: 'black!important',
  },
});

const apiKey = 'b5m6d6hn3m9d';
const chatClient: StreamChat = new StreamChat(apiKey);

export default function ChatDialog({
  open,
  onClose,
  channelListOptions,
  onPreviewSelect,
  // unreadTotalCount,
  setUnreadTotalCount,
}: SimpleDialogProps) {
  const [tab, setTab] = React.useState(0);
  const [token, setToken] = React.useState(null);
  const [fullScreen, setFullScreen] = React.useState(false);
  const [chooseChannel, setChooseChannel] = React.useState(false);
  const [showNotificationBanner, setShowNotificationBanner] =
    React.useState(false);

  const [isCreating, setIsCreating] = useState(false);
  const toggleMobile = useMobileView();
  const [unreadPMCount, setUnreadPMCount] = useState(0);
  const [unreadDMCount, setUnreadDMCount] = useState(0);

  useEffect(() => {
    if (showNotificationBanner) {
      const total_count = unreadPMCount + unreadDMCount;
      setUnreadTotalCount(total_count);
    }
  }, [
    unreadDMCount,
    unreadPMCount,
    setUnreadTotalCount,
    showNotificationBanner,
  ]);

  const onInFull = () => {
    fullScreen ? setFullScreen(false) : setFullScreen(true);
  };

  const user = useSelector((state: any) => state.auth.user);

  const [channel_public, setChannel_public] = useState<ChannelType | null>(
    null
  );
  const [channel_dm, setChannel_dm] = useState<ChannelType | null>(null);

  const DMActionHandler = async (message: StreamMessage) => {
    if (user?.address !== message?.user?.id) {
      // chatClient = new StreamChat(apiKey);
      chatClient.setUser(
        {
          id: user?.address,
          name: user?.username,
        },
        token
      );
      const members = [user?.address, message?.user?.id];
      const channel = chatClient.getChannelByMembers('messaging', {
        members: members,
      });
      if (!channel.initialized)
        await AuthService.getDM([user?.address, message?.user?.id]);
      channel.watch();

      channel.on((event) => {
        if (event.type === 'message.new' && event.unread_count > 0) {
          if (showNotificationBanner) {
            new Notification(event.user.name, {
              body: event.message.text,
            });
          }
        }
        if (event.total_unread_count !== undefined)
          setUnreadDMCount(event.total_unread_count);
      });

      setChannel_dm(channel);
      setTab(1);
      setChooseChannel(true);
    }
  };

  const customMessageActions = { DirectMessage: DMActionHandler };

  useEffect(() => {
    if (!user.address) {
      return;
    }
    void AuthService.getChat(user?.address).then((res) => {
      try {
        setToken(res?.data.data);
        // chatClient.disconnect().then(() => {
        console.log('disconnet');
        void chatClient.setUser(
          {
            id: user?.address,
            name: user?.username,
          },
          res?.data.data
        );

        const channel_public = chatClient.channel('commerce', 'live-chat');

        channel_public.on((event) => {
          if (event.type === 'message.new' && event.unread_count > 0) {
            if (showNotificationBanner) {
              new Notification(event.user.name, {
                body: event.message.text,
              });
            }
          }
          if (event.total_unread_count !== undefined)
            setUnreadPMCount(event.total_unread_count);
        });

        // channel.watch();
        setChannel_public(channel_public);
        // });
      } catch (err) {
        console.log(err);
      }
    });
  }, [user, showNotificationBanner]);

  // useEffect(() => {
  //   const html = document.querySelector('html');
  //   if (html) {
  //     html.style.overflow = open ? 'hidden' : 'auto';
  //   }
  // }, [open]);

  const SuggestionHeader: React.FC<SuggestionListHeaderProps> = (props) => {
    const { value } = props;
    const initialCharacter = value[0];

    switch (initialCharacter) {
      case '@':
        return <div className="suggestion-header">Mention someone...</div>;

      case '/':
        return <div className="suggestion-header">Available commands...</div>;

      case ':':
        return <div className="suggestion-header">Choose an emoji...</div>;

      default:
        return null;
    }
  };

  // type SuggestionItem = BaseEmoji | SuggestionUser | SuggestionCommand;

  // const isEmoji = (output: SuggestionItem): output is BaseEmoji =>
  //   (output as BaseEmoji).native !== null;

  // const isMention = (output: SuggestionItem): output is SuggestionUser =>
  //   (output as SuggestionUser).id !== null &&
  //   (output as SuggestionUser).native === null;

  // const isEmojiOrMention = (
  //   output: SuggestionItem
  // ): output is BaseEmoji | SuggestionUser =>
  //   (output as BaseEmoji | SuggestionUser).id !== null;

  // const SuggestionItem = React.forwardRef(
  //   (props: SuggestionItemProps, ref: React.Ref<HTMLDivElement>) => {
  //     const { item, onClickHandler, onSelectHandler, selected } = props;

  //     const selectItem = () => onSelectHandler(item);

  //     const itemName = isEmojiOrMention(item) ? item.name || item.id : item;
  //     const displayText = isEmoji(item)
  //       ? `${item.native} - ${itemName}`
  //       : itemName;

  //     return (
  //       <div
  //         className={`suggestion-item ${selected ? 'selected' : ''}`}
  //         onClick={onClickHandler}
  //         onMouseEnter={selectItem}
  //         ref={ref}
  //         role="button"
  //         tabIndex={0}
  //       >
  //         {isMention(item) && <Avatar image={item.image} size={20} />}
  //         {displayText}
  //       </div>
  //     );
  //   }
  // );

  useEffect(() => {
    if (localStorage.getItem('Banner') === 'on') {
      setShowNotificationBanner(true);
    }
  }, []);

  function grantPermission() {
    if (localStorage.getItem('Banner') === 'on') {
      localStorage.setItem('Banner', 'off');
      setShowNotificationBanner(false);
      console.log('unread-loc', localStorage.getItem('Banner'));
    } else {
      localStorage.setItem('Banner', 'on');
      setShowNotificationBanner(true);
      console.log('unread-loc', localStorage.getItem('Banner'));
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          new Notification('New message from Stream', {
            body: 'Nice, notifications are now enabled!',
          });
        }
      });
    }
  }

  return (
    <div>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          style: {
            overflow: 'hidden',
            maxWidth: '100%',
          },
        }}
        sx={{
          'zIndex': 10005,
          '& .MuiDrawer-paper': {
            width: {
              xs: '100%',
              md: fullScreen ? '100%' : '40%',
            },
            overflow: 'hidden',
            maxWidth: '100%',
          },
        }}
      >
        <Container sx={{ maxWidth: '100% !important' }}>
          <Box
            display="flex"
            sx={{ flexDirection: 'wrap', justifyContent: 'space-between' }}
          >
            <Box
              sx={{
                borderBottom: 1,
                borderColor: 'transparent',
                mr: 0,
                mt: 1.5,
                mb: -2,
                maxWidth: '100%',
              }}
            >
              <StyledTabs
                value={tab}
                onChange={(_e, n) => setTab(n)}
                onClick={() => setChooseChannel(false)}
              >
                <Tab label="Capsule Chat" />
                {unreadPMCount > 0 && showNotificationBanner && (
                  <Box
                    sx={{
                      background: palette.primary.fire,
                      borderRadius: '10px',
                      width: '18px',
                      height: '18px',
                      paddingLeft: '4px',
                      color: 'white',
                      marginLeft: '20px',
                      marginRight: '15px',
                      justifyContent: 'center',
                    }}
                  >
                    {unreadPMCount}
                  </Box>
                )}
                <Tab label="Messages" />
                {unreadDMCount > 0 && showNotificationBanner && (
                  <Box
                    sx={{
                      background: palette.primary.fire,
                      borderRadius: '10px',
                      width: '18px',
                      height: '18px',
                      color: 'white',
                      marginLeft: '-20px',
                      justifyContent: 'center',
                    }}
                  >
                    {unreadDMCount}
                  </Box>
                )}
              </StyledTabs>
            </Box>
            <Box sx={{ display: 'flex', marginTop: '10px' }}>
              <Button
                sx={{ minWidth: '50px' }}
                onClick={() => grantPermission()}
              >
                {!showNotificationBanner ? (
                  <div title="inactive" style={{ display: 'flex' }}>
                    <img src="images/bell_disable.png" width="12px" alt="" />
                  </div>
                ) : (
                  <div title="active">
                    <img src="images/bell.png" width="12px" alt="" />
                  </div>
                )}
              </Button>
              <Button
                sx={{
                  'minWidth': '50px',
                  'marginBottom': '2px',
                  '@media (max-width: 500px)': {
                    display: 'none',
                  },
                }}
                onClick={() => onInFull()}
              >
                {fullScreen ? (
                  <img src="images/min-icon.png" width="12px" alt="" />
                ) : (
                  <img src="images/chat_full.png" width="12px" alt="" />
                )}
              </Button>
              <Button
                sx={{ minWidth: '50px', marginBottom: '3px' }}
                onClick={onClose}
              >
                <img src="/images/chat_close.png" width="12px" alt="" />
              </Button>
            </Box>
          </Box>
          {!user?.address ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
              }}
            >
              <Typography>Please connect metamask first</Typography>
            </Box>
          ) : tab === 0 ? (
            <Chat client={chatClient} theme="commerce light">
              <Channel
                AutocompleteSuggestionHeader={SuggestionHeader}
                // AutocompleteSuggestionItem={SuggestionItem}
                channel={channel_public}
              >
                <Window>
                  <MessageList customMessageActions={customMessageActions} />
                  <MessageInput focus />
                </Window>
                <Thread />
              </Channel>
            </Chat>
          ) : (
            <Chat client={chatClient} theme="messaging light">
              {!fullScreen && chooseChannel ? (
                ''
              ) : (
                <>
                  {isCreating ? (
                    <CreateChannel
                      toggleMobile={toggleMobile}
                      onClose={() => setIsCreating(false)}
                    />
                  ) : (
                    <Button
                      sx={{
                        'maxWidth': '111px',
                        'height': '40px',
                        'border': 'none',
                        'outline': 'none',
                        'background': '#005fff',
                        'borderRadius': '20px',
                        'fontWeight': 'bold',
                        'fontSize': '15px',
                        'lineHeight': '18px',
                        'color': '#ffffff',
                        'cursor': `url("/images/cursor-pointer.svg"), auto`,
                        'flex': 1,
                        'display': 'flex',
                        'justifyContent': 'left',
                        'marginTop': '10px',
                        'textTransform': 'none',
                        '&:hover': { background: palette.primary.fire },
                      }}
                      onClick={() => setIsCreating(true)}
                    >
                      New Direct Message
                    </Button>
                  )}
                  {!isCreating ? (
                    <ChannelList
                      {...channelListOptions}
                      Preview={(props) => (
                        <MessagingChannelPreview
                          {...props}
                          onClick={function () {
                            onPreviewSelect;
                            setChooseChannel(true);
                          }}
                        />
                      )}
                    />
                  ) : (
                    ''
                  )}

                  {/* channel list ? */}
                </>
              )}
              {fullScreen || chooseChannel ? (
                <Channel channel={channel_dm}>
                  <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput focus />
                  </Window>
                  <Thread />
                </Channel>
              ) : (
                ''
              )}
            </Chat>
          )}
        </Container>
      </Drawer>
    </div>
  );
}
