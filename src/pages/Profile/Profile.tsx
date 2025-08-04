import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import PlainHeroSection from '../../components/PlainHeroSection/PlainHeroSection';
import { getAuthClient } from '../../api/grpc/client';
import { convertTimestampToDate } from '../../utils/date';
import useGrpcApi from '../../hooks/useGrpcApi';

function Profile() {
    const profileApi = useGrpcApi();
    const location = useLocation();
    const navigate = useNavigate();
    const [fullName, setFullName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [memberSince, setMemberSince] = useState<string>();

    useEffect(() => {
        if (location.pathname === '/profile') {
            navigate('/profile/change-password');
        }
    }, [navigate, location.pathname]);

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await profileApi.callApi(getAuthClient().getProfile({}))
            setFullName(res.response.fullName);
            setEmail(res.response.email);

            const dateStr = convertTimestampToDate(res.response.memberSince);
            setMemberSince(dateStr);
        }

        fetchProfile();
    }, []);

    return (
        <>
            <PlainHeroSection title='Profil Saya' />

            <div className="untree_co-section before-footer-section">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-12">
                            <div className="p-4 p-lg-5 border bg-white">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="text-black">Nama Lengkap</label>
                                            <div className="form-control-plaintext">{fullName}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="text-black">Alamat Email</label>
                                            <div className="form-control-plaintext">{email}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="text-black">Anggota Sejak</label>
                                            <div className="form-control-plaintext">{memberSince}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3">
                            <div className="nav flex-column nav-pills">
                                <Link
                                    to="/profile/change-password"
                                    className={`nav-link ${location.pathname === '/profile/change-password' ? 'active' : ''}`}
                                >
                                    Ubah Kata Sandi
                                </Link>
                                <Link
                                    to="/profile/orders"
                                    className={`nav-link ${location.pathname.includes('/profile/orders') ? 'active' : ''}`}
                                >
                                    Riwayat Pesanan
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;
