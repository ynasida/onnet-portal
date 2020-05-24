import React, { Fragment, useState, useEffect } from 'react';
import { connect, formatMessage } from 'umi';
import { Card, Switch } from 'antd';
import { kzUser } from '@/pages/onnet-portal/core/services/kazoo';
import * as _ from 'lodash';

import styles from '../style.less';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';

const ResellerUserMedia = props => {
  const [audioCodecs, setAudioCodecs] = useState([]);
  const [videoCodecs, setVideoCodecs] = useState([]);
  const [isLoading, setIsLoading] = useState({});

  const { dispatch, child_account, child_full_users, owner_id } = props;

  useEffect(() => {
    if (child_full_users[owner_id]) {
      setAudioCodecs(_.get(child_full_users[owner_id].data, 'media.audio.codecs', []));
      setVideoCodecs(_.get(child_full_users[owner_id].data, 'media.video.codecs', []));
    }
    setIsLoading({});
  }, [child_full_users[owner_id]]);

  if (!child_full_users[owner_id]) return null;

  const gridStyle = {
    width: '25%',
    textAlign: 'center',
  };

  const onCodecChange = (checked, media, codec) => {
    setIsLoading({ [codec]: true });
    kzUser({
      method: 'GET',
      account_id: child_account.data?.id,
      owner_id,
    }).then(resp => {
      const codecsList = _.get(resp, `data.media.${media}.codecs`, []);
      let newCodecsList = [];
      if (_.get(resp, `data.media.${media}.codecs`, []).includes(codec)) {
        newCodecsList = _.pull(codecsList, codec);
      } else {
        newCodecsList = _.concat(codecsList, codec);
      }
      const data = {};
      _.set(data, `media.${media}.codecs`, newCodecsList);
      kzUser({
        method: 'PATCH',
        account_id: child_account.data?.id,
        owner_id,
        data,
      }).then(() =>
        dispatch({
          type: 'child_full_users/refresh',
          payload: { account_id: child_account.data?.id, owner_id },
        }),
      );
    });
  };

  return (
    <Fragment>
      <Card hoverable className={styles.card} {...cardProps}>
        <Card.Meta
          title={
            <Fragment>
              {formatMessage({
                id: 'core.Audio_codecs',
                defaultMessage: 'Audio codecs',
              })}
            </Fragment>
          }
          description={
            <>
              <Card.Grid style={gridStyle}>
                <Switch
                  checkedChildren="PCMA"
                  unCheckedChildren="PCMA"
                  checked={audioCodecs.includes('PCMA')}
                  onChange={checked => onCodecChange(checked, 'audio', 'PCMA')}
                  loading={isLoading.PCMA}
                />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <Switch
                  checkedChildren="PCMU"
                  unCheckedChildren="PCMU"
                  checked={audioCodecs.includes('PCMU')}
                  onChange={checked => onCodecChange(checked, 'audio', 'PCMU')}
                  loading={isLoading.PCMU}
                />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <Switch
                  checkedChildren="G722"
                  unCheckedChildren="G722"
                  checked={audioCodecs.includes('G722')}
                  onChange={checked => onCodecChange(checked, 'audio', 'G722')}
                  loading={isLoading.G722}
                />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <Switch
                  checkedChildren="OPUS"
                  unCheckedChildren="OPUS"
                  checked={audioCodecs.includes('OPUS')}
                  onChange={checked => onCodecChange(checked, 'audio', 'OPUS')}
                  loading={isLoading.OPUS}
                />
              </Card.Grid>
            </>
          }
        />
      </Card>
      <Card hoverable className={styles.card} {...cardProps}>
        <Card.Meta
          title={
            <Fragment>
              {formatMessage({
                id: 'core.Video_codecs',
                defaultMessage: 'Video codecs',
              })}
            </Fragment>
          }
          description={
            <>
              <Card.Grid style={gridStyle}>
                <Switch
                  checkedChildren="VP8"
                  unCheckedChildren="VP8"
                  checked={videoCodecs.includes('VP8')}
                  onChange={checked => onCodecChange(checked, 'video', 'VP8')}
                  loading={isLoading.VP8}
                />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <Switch
                  checkedChildren="H264"
                  unCheckedChildren="H264"
                  checked={videoCodecs.includes('H264')}
                  onChange={checked => onCodecChange(checked, 'video', 'H264')}
                  loading={isLoading.H264}
                />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <Switch
                  checkedChildren="H263"
                  unCheckedChildren="H263"
                  checked={videoCodecs.includes('H263')}
                  onChange={checked => onCodecChange(checked, 'video', 'H263')}
                  loading={isLoading.H263}
                />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <Switch
                  checkedChildren="H261"
                  unCheckedChildren="H261"
                  checked={videoCodecs.includes('H261')}
                  onChange={checked => onCodecChange(checked, 'video', 'H261')}
                  loading={isLoading.H261}
                />
              </Card.Grid>
            </>
          }
        />
      </Card>
    </Fragment>
  );
};

export default connect(
  ({ kz_login, kz_account, kz_children, child_account, child_full_users }) => ({
    kz_login,
    kz_account,
    kz_children,
    child_account,
    child_full_users,
  }),
)(ResellerUserMedia);
