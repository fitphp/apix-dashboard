/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { useEffect, useState } from 'react';
import { Statistic, Row, Col, Select, Empty, Form, Card } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useIntl, getIntl } from 'umi';
import moment from 'moment';

import { fetchInfoList, fetchVersion, fetchStatistic } from './service';
import styles from './style.less';


const ServerInfo: React.FC = () => {
  const [data, setData] = useState<ServerInfoModule.Node>();
  const [nodeList, setNodeList] = useState<ServerInfoModule.Node[]>([]);
  const [commitHash, setCommitHash] = useState('');
  const [dashboardVersion, setDashboardVersion] = useState('');
  const { formatMessage } = useIntl();
  const { Option } = Select;

  const [form] = Form.useForm();

  const [statisticInfo, setStatisticInfo] = useState<ServerInfoModule.StatisticInfo>();

  useEffect(() => {
    fetchInfoList().then((infoList) => {
      const { locale } = getIntl();
      const list = infoList.map((item) => {
        return {
          ...item,
          boot_time: moment(item.boot_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
          ...(item.last_report_time
            ? {
                last_report_time: moment(item.last_report_time * 1000).format(
                  'YYYY-MM-DD HH:mm:ss',
                ),
              }
            : {}),
          up_time: moment(item.boot_time * 1000)
            .locale(locale)
            .fromNow(true),
        };
      });

      setNodeList(list);
      if (list.length) {
        form.setFieldsValue({
          nodeId: list[0].id,
        });

        setData(list[0]);
      }
    });

    fetchVersion().then(({ commit_hash, version }) => {
      setCommitHash(commit_hash);
      setDashboardVersion(version);
    });

    fetchStatistic().then((statisticInfo) => {
      setStatisticInfo(statisticInfo)
    });
  }, []);

  return (
    <PageContainer title={formatMessage({ id: 'page.systemStatus.pageContainer.title' })}>
      <Card title={formatMessage({ id: 'page.statistic' })} bodyStyle={{ padding: 0 }} bordered={false} style={{ marginBottom: 15 }}>
        <Row className={styles.row} gutter={16}>
          <Col span={6}>
            <Statistic title={formatMessage({ id: 'page.statistic.router' })} value={statisticInfo?.total_route} />
          </Col>
          <Col span={6}>
            <Statistic title={formatMessage({ id: 'page.statistic.service' })} value={statisticInfo?.total_service} />
          </Col>
          <Col span={6}>
            <Statistic title={formatMessage({ id: 'page.statistic.upstream' })} value={statisticInfo?.total_upstream} />
          </Col>
          <Col span={6}>
            <Statistic title={formatMessage({ id: 'page.statistic.consumer' })} value={statisticInfo?.total_consumer} />
          </Col>
          <Col span={6}>
            <Statistic title={formatMessage({ id: 'page.statistic.ssl' })} value={statisticInfo?.total_ssl} />
          </Col>
          <Col span={6}>
            <Statistic title={formatMessage({ id: 'page.systemStatus.nodeInfo' })} value={statisticInfo?.total_server} />
          </Col>
          <Col span={6}>
            <Statistic title={formatMessage({ id: 'page.systemStatus.version' })} value={dashboardVersion} />
          </Col>
          <Col span={6}>
            <Statistic title={formatMessage({ id: 'page.systemStatus.commitHash' })} value={commitHash} />
          </Col>
        </Row>
      </Card>

      <Card
        title={formatMessage({ id: 'page.systemStatus.nodeInfo' })}
        bodyStyle={{ padding: 0 }}
        bordered={false}
      >
        <div className={styles.select}>
          <Form form={form}>
            <Form.Item wrapperCol={{ span: 10 }} style={{ marginBottom: 0 }} name="nodeId">
              <Select
                placeholder={formatMessage({ id: 'page.systemStatus.select.placeholder' })}
                onChange={(value) => {
                  setData(
                    nodeList.find((item) => {
                      return item.id === value;
                    }),
                  );
                }}
              >
                {nodeList.map((item) => (
                  <Option key={item.hostname} value={item.id}>
                    {item.hostname}
                  </Option>
                ))}
                ;
              </Select>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, fontSize: '12px', color: '#00000073' }}>
              {formatMessage({ id: 'page.systemStatus.desc' })}
            </Form.Item>
          </Form>
        </div>
        <div className={styles.wrap}>
          {nodeList.length === 0 && <Empty />}
          {nodeList.length > 0 && (
            <table className={styles.table}>
              <tbody>
                {Object.entries(data || {}).map((item) => (
                  <tr>
                    <td>{item[0]}</td>
                    <td>{item[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </PageContainer>
  );
};

export default ServerInfo;
