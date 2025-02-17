import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ACCESS_TOKEN = 'EAAQIZAsEDpooBOwg4hGNBo04uYmY2OLAbnrJl5HuqSbE4odORHX2GU2VJO0gmAK4EWZBB8jq6I9Ka3EYeXwNp5lTkDEDM8yWA2yKOCXSwHrp8frZBIk6PNliawcqqspqAiPX5WeZBAfoqy2J6sAN5dOK7JD5g6436JZA675SQI8JzbpwD2XZBhyfpenCP4FoPZAfg2KZBU4AASb6ZBZAKkeCSiICgZBu0nke3uLv64ZD';
const IG_USER_ID = '17841460045847884';
const BASE_URL = 'https://graph.facebook.com/v22.0';

const AggregatedMetrics = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [insights, setInsights] = useState(null);
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kullanıcı bilgilerini çek
    const fetchUserInfo = async () => {
      const response = await axios.get(`${BASE_URL}/${IG_USER_ID}`, {
        params: {
          fields: 'username,followers_count',
          access_token: ACCESS_TOKEN
        }
      });
      setUserInfo(response.data);
    };

    // Insights verilerini çek
    const fetchInsights = async () => {
      const response = await axios.get(`${BASE_URL}/${IG_USER_ID}/insights`, {
        params: {
          metric: 'impressions,reach,profile_views',
          period: 'day',
          access_token: ACCESS_TOKEN
        }
      });
      setInsights(response.data);
    };

    // Son 10 gönderinin detaylarını çekmek için /media edge'ini kullan
    const fetchMedia = async () => {
      const response = await axios.get(`${BASE_URL}/${IG_USER_ID}/media`, {
        params: {
          fields: 'id,caption,media_type,media_url,permalink,timestamp,comments_count,like_count',
          limit: 10,
          access_token: ACCESS_TOKEN
        }
      });
      setMedia(response.data);
    };

    // Tüm istekleri paralel olarak gerçekleştirip, sonuçları bekliyoruz.
    Promise.all([fetchUserInfo(), fetchInsights(), fetchMedia()])
      .then(() => setLoading(false))
      .catch((err) => {
        console.error('API isteği sırasında hata:', err.response ? err.response.data : err.message);
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error.message}</div>;

  return (
    <div>
      <h2>Toplu Performans Verileri</h2>

      <section>
        <h3>Kullanıcı Bilgileri</h3>
        {userInfo ? (
          <>
            <p><strong>Kullanıcı Adı:</strong> {userInfo.username}</p>
            <p><strong>Takipçi Sayısı:</strong> {userInfo.followers_count}</p>
          </>
        ) : (
          <p>Kullanıcı bilgisi bulunamadı.</p>
        )}
      </section>

      <section>
        <h3>Insights Verileri</h3>
        {insights && insights.data ? (
          insights.data.map((metric) => (
            <div key={metric.name}>
              <p>
                <strong>{metric.name}</strong>: {JSON.stringify(metric.values)}
              </p>
            </div>
          ))
        ) : (
          <p>Insights verisi bulunamadı.</p>
        )}
      </section>

      <section>
        <h3>Son 10 Gönderi</h3>
        {media && media.data ? (
          media.data.map((post) => (
            <div key={post.id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
              <p><strong>Gönderi ID:</strong> {post.id}</p>
              <p><strong>Açıklama:</strong> {post.caption || 'Yok'}</p>
              <p><strong>Yorum Sayısı:</strong> {post.comments_count}</p>
              <p><strong>Beğeni Sayısı:</strong> {post.like_count}</p>
              <p>
                <strong>Medya URL:</strong>{' '}
                <a href={post.media_url} target="_blank" rel="noopener noreferrer">
                  {post.media_url}
                </a>
              </p>
              <p><strong>Zaman Damgası:</strong> {post.timestamp}</p>
            </div>
          ))
        ) : (
          <p>Gönderi verisi bulunamadı.</p>
        )}
      </section>
    </div>
  );
};

export default AggregatedMetrics;
