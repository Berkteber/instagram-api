import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InstagramInsights = () => {
  const [dailyReach, setDailyReach] = useState(null);
  const [dailyFollowers, setDailyFollowers] = useState(null);
  const [error, setError] = useState(null);

  const accessToken = 'EAAQIZAsEDpooBO7JjQz2UqHMml8ZARw2WeJ039NvlbiSrLdDkkW9lmzgTsZALyuZC9KAVp4kXnKboNNILN6lHZAM5II3KsZB3pZAhrA1tQcMstmUZBM6S8n7vbskFzJIsezkZCEAiY9z3bZAapk4gvaAScrESIrwtnCALKC6hfIlNmhLOuImZBKR7qRY8uh9og1YHHdNTqVdmR7ewLxoVmuLhmNKL30owZDZD';
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
