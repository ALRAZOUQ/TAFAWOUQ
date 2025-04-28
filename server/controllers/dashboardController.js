import db from '../config/db.js'

const dashboardController = {
  //==================================================
  //================= charts =========================
  //==================================================
  async getTwoMonthsComparison(req, res) {
    try {
      const { currentMonth, secondMonth } = req.query
      const query = `WITH params AS (
  SELECT
    date_trunc('month', $1::date)::date AS month_start,
    (date_trunc('month', $1::date) + INTERVAL '1 month' - INTERVAL '1 day')::date AS month_end
),
calendar AS (
  SELECT
    generate_series(month_start, month_end, INTERVAL '1 day') AS day
  FROM params
),
comment_counts AS (
  SELECT
    DATE(creationdate) AS day,
    COUNT(*)          AS num_comments
  FROM public.comment
  WHERE creationdate >= (SELECT month_start FROM params)
    AND creationdate <= (SELECT month_end   FROM params)
  GROUP BY DATE(creationdate)
)
SELECT
  EXTRACT(DAY FROM c.day)::int  AS day_number,
  COALESCE(cc.num_comments,0)   AS num_comments
FROM calendar c
LEFT JOIN comment_counts cc
  ON cc.day = c.day
ORDER BY c.day;`
      const { rows: currentMonthData } = await db.query(query, [currentMonth]);
      const { rows: secondMonthData } = await db.query(query, [secondMonth]);

      // getting the shorter month :
      const shorterMonthLength = currentMonthData.length < secondMonthData.length ? currentMonthData.length : secondMonthData.length
      let chartData = []
      for (let i = 0; i < shorterMonthLength; i++) {
        chartData.push({
          date: i,
          desktop: currentMonthData[i].num_comments,
          mobile: secondMonthData[i].num_comments
        })
      }
      res.status(200).json({ chartData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getCourseCommentsPerDay(req, res) {
    try {
      const { selectedCourseId, selectedMonth } = req.query
      const { rows: theCommentsCountForTheMonthDays } = await db.query(`WITH
  month_bounds AS (
    SELECT
      date_trunc('month', $1::date) AS start_date,
      (date_trunc('month', $1::date) + interval '1 month') AS next_month
  ),
  days AS (
    SELECT generate_series(start_date, next_month - interval '1 day', '1 day')::date AS day
    FROM month_bounds
  ),
  counts AS (
    SELECT
      creationdate::date AS day,
      COUNT(*) AS desktop
    FROM public.comment, month_bounds mb
    WHERE courseid = $2
      AND creationdate >= mb.start_date
      AND creationdate <  mb.next_month
    GROUP BY creationdate::date
  )
SELECT
  EXTRACT(DAY FROM d.day)::int AS day,
  COALESCE(c.desktop, 0) AS desktop
FROM days d
LEFT JOIN counts c USING (day)
ORDER BY day;
`, [selectedMonth, selectedCourseId]);

      // getting the shorter month :

      res.status(200).json({ theCommentsCountForTheMonthDays });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


  //==================================================
  //================== Toppers =======================
  //==================================================
  async getTop20Commenters(req, res) {
    try {
      const { rows: top20Commenters } = await db.query(`SELECT
  u.id,
  u.name,
  u.email,
  COUNT(c.id) AS comment_count
FROM
  public."user" AS u
JOIN
  public.comment AS c
  ON u.id = c.authorid
GROUP BY
  u.id,
  u.name,
  u.email
ORDER BY
  comment_count DESC
LIMIT 20;
`);

      res.status(200).json({ top20Commenters });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getTop20Courses(req, res) {
    try {
      const { rows: top20Courses } = await db.query(`SELECT
  c.id,
  c.name AS full_name,
  c.code  AS name ,
  COUNT(cm.id) AS comment_count
FROM
  public.course AS c
LEFT JOIN
  public.comment AS cm
    ON c.id = cm.courseid
GROUP BY
  c.id,
  c.name,
  c.code
ORDER BY
  comment_count DESC
LIMIT 20;
`);

      res.status(200).json({ top20Courses });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default dashboardController