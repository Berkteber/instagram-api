import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ACCESS_TOKEN = 'EAAQIZAsEDpooBO8ggFFAL6rZC8k7f303Dj3ZCqssfsAeZAOCaq4yumMBBzKqOocWCWWwajGRl7AHASGiBLWyZBXgyy1sbvRFfUcd6oBeQ0gbkTdCpmW9W9ZClueCU4W2hDZCVvgH5S9ZAgkKKGdmcAZB2pG382eJTXKX36dMuYYGc5SEkM23FuvHSm086NYdXiuaZBnHFXxSjZCodpiocc5ZB8nkbz1WhwZDZD';  // Geçerli erişim tokenınızı buraya ekleyin.
const IG_USER_ID = '17841460045847884';        
const BASE_URL = 'https://graph.facebook.com/v22.0';

const InsightsMetrics = () => {
  const [insightsData, setInsightsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${IG_USER_ID}/insights?metric=reach&period=day&access_token=${ACCESS_TOKEN}`);
        setInsightsData(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Insights verileri çekilirken hata:', err.response ? err.response.data : err.message);
        setError(err);
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  // Son iki günün verisini karşılaştırıp artış/azalış oranını hesaplayan fonksiyon.
  const calculateGrowthRate = (values) => {
    if (!values || values.length < 2) return null;
    // values dizisinin kronolojik olarak artan sırada olduğunu varsayıyoruz.
    const latest = values[values.length - 1].value;
    const previous = values[values.length - 2].value;
    if (previous === 0) return null;
    const rate = ((latest - previous) / previous) * 100;
    return rate.toFixed(2);
  };

  if (loading) return <div>Performans verileri yükleniyor...</div>;
  if (error) return <div>Hata: {error.message}</div>;

  return (
    <div>
      <h1>Instagram Insights Metrics</h1>
      {insightsData.map(metric => (
        <div key={metric.name} style={{ border: '1px solid #ddd', margin: '10px', padding: '10px' }}>
          <h3>{metric.title}</h3>
          <p>{metric.description}</p>
          {metric.values && metric.values.length > 0 ? (
            <>
              <p>
                <strong>En Güncel Değer:</strong> {metric.values[metric.values.length - 1].value}
              </p>
              <p>
                <strong>Tarih:</strong> {metric.values[metric.values.length - 1].end_time}
              </p>
              {calculateGrowthRate(metric.values) !== null ? (
                <p>
                  <strong>Artış/Azalış Oranı:</strong> {calculateGrowthRate(metric.values)}%
                </p>
              ) : (
                <p>Yeterli veri yok.</p>
              )}
            </>
          ) : (
            <p>Veri bulunamadı.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default InsightsMetrics;
