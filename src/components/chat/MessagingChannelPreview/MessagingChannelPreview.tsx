import {
  ChannelPreviewUIComponentProps,
  ChatContextValue,
  useChatContext,
} from 'stream-chat-react';

import type { Channel, ChannelMemberResponse } from 'stream-chat';
import type { DefaultStreamChatGenerics } from 'stream-chat-react/dist/types/types';
import { AuthService } from '../../../services/auth.service';
import { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import styles from './style.module.css';

const getTimeStamp = (channel: Channel) => {
  let lastHours = channel.state.last_message_at?.getHours();
  let lastMinutes: string | number | undefined =
    channel.state.last_message_at?.getMinutes();
  let half = 'AM';

  if (lastHours === undefined || lastMinutes === undefined) {
    return '';
  }

  if (lastHours > 12) {
    lastHours = lastHours - 12;
    half = 'PM';
  }

  if (lastHours === 0) lastHours = 12;
  if (lastHours === 12) half = 'PM';

  if (lastMinutes.toString().length === 1) {
    lastMinutes = `0${lastMinutes}`;
  }

  return `${lastHours}:${lastMinutes} ${half}`;
};

const getChannelName = (members: ChannelMemberResponse[]) => {
  const defaultName = 'Direct Message';

  if (!members.length || members.length === 1) {
    return members[0]?.user?.name || defaultName;
  }

  return `${members[0]?.user?.name || defaultName}, ${
    members[1]?.user?.name || defaultName
  }`;
};

type MessagingChannelPreviewProps = ChannelPreviewUIComponentProps & {
  channel: Channel;
  onClick: (e: any) => any;
  setActiveChannel?: ChatContextValue['setActiveChannel'];
};

const MessagingChannelPreview = (props: MessagingChannelPreviewProps) => {
  const { channel, lastMessage, onClick, setActiveChannel } = props;
  const { channel: activeChannel, client } =
    useChatContext<DefaultStreamChatGenerics>();

  console.log(activeChannel);

  const members = Object.values(channel.state.members).filter(
    ({ user }) => user?.id !== client.userID
  );

  const [photo, setPhoto] = useState('/images/profile-avatar.svg');
  useEffect(() => {
    void AuthService.getUser(members[0]?.user_id).then((res) => {
      const user = res?.data?.data;
      if ('profile_picture' in user) {
        setPhoto(user.profile_picture as string);
      }
    });
  }, [members]);

  return (
    <div
      className={styles['channel-preview__container']}
      onClick={(e) => {
        onClick && onClick(e);
        setActiveChannel?.(channel);
      }}
    >
      <div className={styles['channel-preview__content-wrapper']}>
        <div className={styles['channel-preview__content-top']}>
          <div className={styles['channel-preview__content']}>
            <Avatar
              alt="Remy Sharp"
              src={photo}
              sx={{ cursor: `url("/images/cursor-pointer.svg"), auto` }}
            />
            <div className={styles['channel-preview__content-name_message']}>
              <p className={styles['channel-preview__content-name']}>
                {getChannelName(members) || getChannelName(members)}
              </p>
              <p className={styles['channel-preview__content-message']}>
                {lastMessage?.text ?? 'Send a message'}
              </p>
            </div>
          </div>
          <p className={styles['channel-preview__content-time']}>
            {getTimeStamp(channel)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessagingChannelPreview;
