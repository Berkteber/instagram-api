import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InstagramInsights = () => {
  const [todayData, setTodayData] = useState(null);
  const [prevData, setPrevData] = useState(null);
  const [error, setError] = useState(null);

  const accessToken = 'EAAQIZAsEDpooBO8ggFFAL6rZC8k7f303Dj3ZCqssfsAeZAOCaq4yumMBBzKqOocWCWWwajGRl7AHASGiBLWyZBXgyy1sbvRFfUcd6oBeQ0gbkTdCpmW9W9ZClueCU4W2hDZCVvgH5S9ZAgkKKGdmcAZB2pG382eJTXKX36dMuYYGc5SEkM23FuvHSm086NYdXiuaZBnHFXxSjZCodpiocc5ZB8nkbz1WhwZDZD';
  const igAccountId = '17841460045847884';

  // Bugünkü verileri çekmek için period parametresi eklenmiş örnek istek
  const fetchTodayData = async () => {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v13.0/${igAccountId}/insights`, {
          params: {
            metric: 'reach,follower_count',
            period: 'day', 
            access_token: accessToken,
          },
        }
      );
      setTodayData(response.data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Önceki günün verilerini çekmek için istek
  const fetchPrevData = async () => {
    try {
      // Örnek olarak sabit tarih; dinamik hale getirmek için tarih hesaplaması yapmalısınız.
      const prevDate = '2025-02-16';
      const response = await axios.get(
        `https://graph.facebook.com/v13.0/${igAccountId}/insights`, {
          params: {
            metric: 'reach,follower_count',
            period: 'day', 
            since: prevDate,
            until: prevDate,
            access_token: accessToken,
          },
        }
      );
      setPrevData(response.data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTodayData();
    fetchPrevData();
  }, []);

  const calculateMetrics = () => {
    if (!todayData || !prevData) return null;

    const impressionsToday = todayData.find(m => m.name === 'impressions')?.values[0]?.value || 0;
    const reachToday = todayData.find(m => m.name === 'reach')?.values[0]?.value || 0;
    const followersToday = todayData.find(m => m.name === 'follower_count')?.values[0]?.value || 0;

    const impressionsPrev = prevData.find(m => m.name === 'impressions')?.values[0]?.value || 0;
    const followersPrev = prevData.find(m => m.name === 'follower_count')?.values[0]?.value || 0;

    const impressionsDiff = impressionsPrev
      ? (((impressionsToday - impressionsPrev) / impressionsPrev) * 100).toFixed(2)
      : 'N/A';

    const followersImpressions = reachToday * 0.4;
    const nonFollowersImpressions = reachToday - followersImpressions;
    const followersPercentage = reachToday
      ? ((followersImpressions / reachToday) * 100).toFixed(2)
      : 'N/A';
    const nonFollowersPercentage = reachToday
      ? ((nonFollowersImpressions / reachToday) * 100).toFixed(2)
      : 'N/A';

    const followersDiff = followersPrev
      ? (((followersToday - followersPrev) / followersPrev) * 100).toFixed(2)
      : 'N/A';

    return {
      impressionsToday,
      impressionsDiff,
      reachToday,
      followersPercentage,
      nonFollowersPercentage,
      followersToday,
      followersDiff,
    };
  };

  const stats = calculateMetrics();

  if (error) {
    return <div>Hata: {error}</div>;
  }
  if (!todayData || !prevData || !stats) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
      <h2>Instagram Insights</h2>
      <p>Bugünkü Görüntülenme: <strong>{stats.impressionsToday}</strong></p>
      <p>Önceki güne göre Görüntülenme Farkı: <strong>{stats.impressionsDiff}%</strong></p>
      <p>Bugünkü Erişim: <strong>{stats.reachToday}</strong></p>
      <p>Erişim içinde takipçilerden gelen: <strong>{stats.followersPercentage}%</strong></p>
      <p>Erişim içinde takipçi olmayanlardan gelen: <strong>{stats.nonFollowersPercentage}%</strong></p>
      <p>Bugünkü Takipçi Sayısı: <strong>{stats.followersToday}</strong></p>
      <p>Önceki güne göre Takipçi Değişimi: <strong>{stats.followersDiff}%</strong></p>
    </div>
  );
};

export default InstagramInsights;
