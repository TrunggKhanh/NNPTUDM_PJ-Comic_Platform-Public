// AdminRoutes.jsx
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import PrivateRoute from "../area-manager/PrivateRoute";

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import PaymentIndex from './pages/comic/payment/Index';

const Dashboard = lazy(() => import('./views/dashboard/index'));
const SignIn1 = lazy(() => import('./views/auth/signin/SignIn1'));
const SignUp1 = lazy(() => import('./views/auth/signup/SignUp1'));
const BasicButton = lazy(() => import('./views/ui-elements/basic/BasicButton'));
const BasicBreadcrumb = lazy(() => import('./views/ui-elements/basic/BasicBreadcrumb'));
const BasicBadges = lazy(() => import('./views/ui-elements/basic/BasicBadges'));
const BasicCollapse = lazy(() => import('./views/ui-elements/basic/BasicCollapse'));
const BasicTabsPills = lazy(() => import('./views/ui-elements/basic/BasicTabsPills'));
const BasicTypography = lazy(() => import('./views/ui-elements/basic/BasicTypography'));
const FormsElements = lazy(() => import('./views/forms/FormsElements'));
const GoogleMaps = lazy(() => import('./views/maps/GoogleMaps'));
const Chart = lazy(() => import('./views/charts/nvd3-chart'));
const SamplePage = lazy(() => import('./views/extra/SamplePage'));

const AuthorIndex = lazy(() => import('./pages/comic/author/Index'));
const ComicIndex = lazy(() => import('./pages/comic/Index'));
const ChapterDetail = lazy(() => import('./pages/comic/chapter/DemoReadingMode'));
const ComicDetail = lazy(() => import('./pages/comic/Detail'));
const EditC = lazy(() => import('./pages/comic/Update'));
const GerneIndex = lazy(() => import('./pages/comic/gerne/Index'));
const StaffIndex = lazy(() => import('./pages/user/staff/Index'));
const CustomerIndex = lazy(() => import('./pages/user/customer/Index'));
const RBACIndex = lazy(() => import('./pages/config-service/RBAC-index'));
const RBACDetail = lazy(() => import('./pages/config-service/RBAC-controll'));
const PaymentDetail = lazy(() => import('./pages/comic/payment/Detail'));
const PaymentMIndex = lazy(() => import('./pages/comic/payment/Index'));


export default function AdminRoutes() {
  return (
    <div className="admin-root">
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="login" element={<SignIn1 />} />
          <Route path="auth/signin-1" element={<SignIn1 />} />
          <Route path="auth/signup-1" element={<SignUp1 />} />
          <Route
            path="*"
            element={
              <PrivateRoute> {/* Bọc route cần bảo vệ */}
                <AdminLayout>
                  <Suspense fallback={<Loader />}>
                    <Routes>
                      <Route index element={<Dashboard />} />
                      <Route path="basic/button" element={<BasicButton />} />
                      <Route path="basic/badges" element={<BasicBadges />} />
                      <Route path="basic/breadcrumb" element={<BasicBreadcrumb />} />
                      <Route path="basic/collapse" element={<BasicCollapse />} />
                      <Route path="basic/tabs" element={<BasicTabsPills />} />
                      <Route path="basic/typography" element={<BasicTypography />} />
                      <Route path="form" element={<FormsElements />} />
                      <Route path="bootstrap" element={<BasicBadges />} />
                  
                      <Route path="map" element={<GoogleMaps />} />
                      <Route path="basic/page" element={<SamplePage />} />
                      <Route path="*" element={<Navigate to="/manager" />} />

                      <Route path="comic/comic-index" element={<ComicIndex />} />
                      <Route path="comic/comic-index/comic-detail/:id" element={<ComicDetail />} />
                      <Route path="comic/comic-index/comic-detail/chapter-detail/demo-reading-mode-view/:chapterId" element={<ChapterDetail />} />
                      <Route path="comic/author-index" element={<AuthorIndex />} />
                      <Route path="comic/payment-index" element={<PaymentIndex />} />
                      <Route path="comic/gerne-index" element={<GerneIndex />} />
                      <Route path="user/staff-index" element={<StaffIndex />} />
                      <Route path="user/customer-index" element={<CustomerIndex />} />
                      <Route path="user/customer-index/customer-payment-detail/:id" element={<PaymentDetail />} />
                      <Route path="payment/payment-index" element={<PaymentMIndex />} />
                      <Route path="config/rbac-control" element={<RBACIndex />} />
                      <Route path="config/rbac-control/rbac-staff-detail" element={<RBACDetail />} />
                      
                      <Route path="comic/edit" element={<EditC />} />
                      <Route path="comic/payment-index/chart" element={<Chart />} />


                    </Routes>
                  </Suspense>
                </AdminLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}
