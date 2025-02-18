import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InstagramInsights = () => {
  const [dailyReach, setDailyReach] = useState(null);
  const [dailyFollowers, setDailyFollowers] = useState(null);
  const [error, setError] = useState(null);

  const accessToken = 'EAAQIZAsEDpooBO8ggFFAL6rZC8k7f303Dj3ZCqssfsAeZAOCaq4yumMBBzKqOocWCWWwajGRl7AHASGiBLWyZBXgyy1sbvRFfUcd6oBeQ0gbkTdCpmW9W9ZClueCU4W2hDZCVvgH5S9ZAgkKKGdmcAZB2pG382eJTXKX36dMuYYGc5SEkM23FuvHSm086NYdXiuaZBnHFXxSjZCodpiocc5ZB8nkbz1WhwZDZD';
  const igAccountId = '17841460045847884';

  const fetchInsightsData = async () => {
    try {
      const [
        reachResponse,
        followersResponse
      ] = await Promise.all([
        axios.get(`https://graph.facebook.com/v21.0/${igAccountId}/insights`, {
          params: { metric: 'reach', period: 'day', access_token: accessToken },
        }),
        axios.get(`https://graph.facebook.com/v21.0/${igAccountId}/insights`, {
          params: { metric: 'follower_count', period: 'day', access_token: accessToken },
        }),
      ]);

      setDailyReach(reachResponse.data.data[0]?.values[0]?.value || 0);
      setDailyFollowers(followersResponse.data.data[0]?.values[0]?.value || 0);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchInsightsData();
  }, []);

  if (error) {
    return <div>Hata: {error}</div>;
  }
  if (dailyReach === null || dailyFollowers === null) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
      <h2>📊 Instagram Günlük Verileri</h2>
      <p>👀 <strong>Günlük Erişim (Reach):</strong> {dailyReach}</p>
      <p>📈 <strong>Günlük Takipçi Sayısı:</strong> {dailyFollowers}</p>
    </div>
  );
};

export default InstagramInsights;
