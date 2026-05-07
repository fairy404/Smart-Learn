import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";

const activities = [
  { id: 1, title: "تطوير تطبيقات", desc: "بناء تطبيقات React", full: "تعلم بناء تطبيق كامل باستخدام React و Supabase", date: "2026-06-25", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c" },
  { id: 2, title: "JavaScript", desc: "أساسيات JS", full: "تعلم JS من الصفر", date: "2026-06-26", img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4" },
  { id: 3, title: "UI/UX", desc: "تصميم واجهات", full: "تعلم التصميم باستخدام Figma", date: "2026-06-27", img: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e" },
  { id: 4, title: "Cyber Security", desc: "الأمن السيبراني", full: "تعلم أساسيات حماية الأنظمة", date: "2026-06-28", img: "https://images.unsplash.com/photo-1510511233900-1982d92bd835" },
  { id: 5, title: "AI Basics", desc: "الذكاء الاصطناعي", full: "مقدمة في AI و Machine Learning", date: "2026-06-29", img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d" }
];

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="navbar">
      <div className="logo">✨ Smart Learn</div>

      <div>
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/my">My Activities</Link>
        <Link to="/about">About</Link>
      </div>

      <div>
        {user ? (
          <>
            <span>{user.email}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.href = "/";
    });
  }, []);

  const handleLogin = async () => {
    if (
      !email.includes("@") ||
      email.indexOf("@") === 0 ||
      email.indexOf("@") === email.length - 1
    ) {
      alert("الإيميل خطأ");
      return;
    }

    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "http://localhost:3000" }
    });

    alert("تحقق من الإيميل");
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <input type="email" onChange={(e) => setEmail(e.target.value)} />
      <br /><br />
      <button onClick={handleLogin}>Send</button>
    </div>
  );
} function Home() {
  const register = async (id) => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      alert("سجل دخول أول");
      return;
    }

    const { error } = await supabase.from("registrations").insert([
      { activity_id: id, user_id: data.user.id }
    ]);

    if (error) alert("خطأ");
    else alert("تم التسجيل");
  };

  return (
    <div className="container">
      <h1>Activities</h1>

      {activities.map((a) => (
        <div key={a.id} className="card">
          <img src={a.img} className="card-img" alt={a.title} />
          <h3>{a.title}</h3>
          <p>{a.desc}</p>
          <p>{a.date}</p>

          <button onClick={() => register(a.id)}>تسجيل</button>
          <br /><br />

          <Link to={`/activity/${a.id}`}>Details</Link>
        </div>
      ))}
    </div>
  );
}

function ActivityDetails() {
  const { id } = useParams();
  const activity = activities.find((a) => a.id === parseInt(id));

  if (!activity) return <p>Not found</p>;

  return (
    <div className="container">
      <img src={activity.img} className="card-img" alt="Activity" />
      <h1>{activity.title}</h1>
      <p>{activity.full}</p>
      <p>{activity.date}</p>
    </div>
  );
}
function MyActivities() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data } = await supabase
      .from("registrations")
      .select("activity_id")
      .eq("user_id", userData.user.id);

    setData(data || []);
  };

  return (
    <div className="container">
      <h1>My Activities</h1>

      {data.map((item, i) => {
        const a = activities.find(x => x.id === item.activity_id);

        return (
          <div key={i} className="card">
            <img src={a?.img} className="card-img" alt={a?.title} />
            <h3>{a?.title}</h3>
            <p>{a?.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

function About() {
  return (
    <div className="container">
      <h1>About</h1>
      <p>Smart Learn منصة تعليمية</p>
    </div>
  );
}

function Courses() {
  return (
    <div className="container">
      <h1>Courses</h1>

      {activities.map((a) => (
        <div key={a.id} className="card">
          <img src={a.img} className="card-img" alt={a.title} />
          <h3>{a.title}</h3>
          <p>{a.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/activity/:id" element={<ActivityDetails />} />
        <Route path="/my" element={<MyActivities />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}