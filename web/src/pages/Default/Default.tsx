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
import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {Card } from 'antd';
import {useIntl } from 'umi';

import {fetchVersion } from '../ServerInfo/service';
import styles from './style.less';

const Dashboard: React.FC = () => {
  const { formatMessage } = useIntl();

  const [commitHash, setCommitHash] = useState('');
  const [dashboardVersion, setDashboardVersion] = useState('');

  useEffect(() => {
    fetchVersion().then(({ commit_hash, version }) => {
      setCommitHash(commit_hash);
      setDashboardVersion(version);
    });
  }, []);

  return (
    <PageHeaderWrapper title="APIX">
      <Card
        title={formatMessage({ id: 'page.systemStatus.dashboardInfo' })}
        bodyStyle={{ padding: 0 }}
        style={{ marginBottom: 15 }}
      >
        <div className={styles.wrap}>
          <table className={styles.table}>
            <tbody>
              <tr>
                <td>version</td>
                <td>{dashboardVersion}</td>
              </tr>
              <tr>
                <td>commit_hash</td>
                <td>{commitHash}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </PageHeaderWrapper>
  );
};

export default Dashboard;
