import  { Suspense, lazy, useEffect } from "react";
import { useLocation, matchPath, Routes, Route } from "react-router-dom";

// CSS transitions
import "./styles/components/Transitions.css";

// Import Header, Footer và các thành phần
import Header from "./components/Element/Header";
import Footer from "./components/Element/Footer";
import ScrollToTopButton from "./components/Element/ScrollToTopButton";
import Loader from "./components/Element/Loader";
import Payment from "pages/Payment";
import SendEmail from "pages/SendEmail";

// Lazy-load các component chính
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Rankings = lazy(() => import("./pages/Rankings"));
const ListTrendingComics = lazy(() => import("./pages/ListTrendingComics"));
const ListTypeComics = lazy(() => import("./pages/ListTypeComics"));
const ListLatestComics = lazy(() => import("./pages/ListLatestComics"));
const CtBoTruyen = lazy(() => import("./pages/botruyen/CTBoTruyen"));
const Chapter = lazy(() => import("./pages/botruyen/Chapter"));
const Infor = lazy(() => import("./pages/Infor"));
const AuthSuccess = lazy(() => import("./components/Element/AuthSuccess"));
const Account = lazy(() => import("./pages/khachhang/Account"));
const History = lazy(() => import("./pages/khachhang/History"));
const Following = lazy(() => import("./pages/khachhang/Following"));

const PublicRoutes = () => {
    const location = useLocation();
    // const [isLoading, setIsLoading] = useState(true);
    const isAdminPath = matchPath({ path: '/manager/*', end: false }, location.pathname) != null;

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const userData = queryParams.get("user");
        if (userData) {
            localStorage.setItem("user", userData);
            window.history.replaceState(null, "", "/");
        }
    }, [location]);

    const noHeaderFooterRoutes = ["/login", "/register", "/infor", "/auth/success", "/manager/*"];
    const isNoHeaderFooter = noHeaderFooterRoutes.some(path =>
        matchPath({ path, end: false }, location.pathname)
    );

    return (
        <div className="public-root">
            {!isNoHeaderFooter && !isAdminPath && <Header />}
            <main role="main" className="fade-in">
                <Suspense fallback={<Loader isLoading={true} />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/trending" element={<ListTrendingComics />} />
                        <Route path="/latest" element={<ListLatestComics />} />
                        <Route path="/:id" element={<ListTypeComics />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/rankings/:type" element={<Rankings />} />
                        <Route path="/premium" element={<Payment />} />
                        <Route path="/comic/:id" element={<CtBoTruyen />} />
                        <Route path="/chapter/:id_bo/:stt_chap" element={<Chapter />} />
                        <Route path="/infor" element={<Infor />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/following" element={<Following />} />
                        <Route path="/auth/success" element={<AuthSuccess />} />
                        <Route path="/email" element={<SendEmail />} />
                    </Routes>
                </Suspense>
                <ScrollToTopButton />
            </main>
            {!isNoHeaderFooter && !isAdminPath && <Footer />}
        </div>
    );
};

export default PublicRoutes;
