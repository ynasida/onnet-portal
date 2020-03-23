import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Card, Switch } from 'antd';
import { kzDevice } from '@/pages/onnet-portal/core/services/kazoo';
import * as _ from 'lodash';
import { useMediaQuery } from 'react-responsive';

import styles from '../style.less';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';

const DeviceMedia = props => {
  const [audioCodecs, setAudioCodecs] = useState([]);
  const [videoCodecs, setVideoCodecs] = useState([]);
  const [isLoading, setIsLoading] = useState({});

  const { dispatch, account, full_devices, device_id } = props;
  const isSmallDevice = useMediaQuery({ maxWidth: 991 });

  useEffect(() => {
    if (full_devices[device_id]) {
      setAudioCodecs(_.get(full_devices[device_id].data, 'media.audio.codecs', []));
      setVideoCodecs(_.get(full_devices[device_id].data, 'media.video.codecs', []));
    }
    setIsLoading({});
  }, [full_devices[device_id]]);

  if (!full_devices[device_id]) return null;

  const gridStyle = {
    width: isSmallDevice ? '50%' : '25%',
    textAlign: 'center',
  };

  const onCodecChange = (checked, media, codec) => {
    setIsLoading({ [codec]: true });
    kzDevice({
      method: 'GET',
      account_id: account.data.id,
      device_id,
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
      kzDevice({
        method: 'PATCH',
        account_id: account.data.id,
        device_id,
        data,
      }).then(() =>
        dispatch({
          type: 'kz_full_devices/refresh',
          payload: { account_id: account.data.id, device_id },
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

export default connect(({ kz_account, kz_full_devices }) => ({
  account: kz_account,
  full_devices: kz_full_devices,
}))(DeviceMedia);
