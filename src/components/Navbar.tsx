import React, { useState, useEffect, useRef } from 'react';
import { Compass, Search, ChevronDown, Menu, X, ArrowRight, Sun, Moon, MapPin, Heart } from 'lucide-react';
import { DESTINATIONS } from '../data/travelData';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

interface NavbarProps {
  onPlanTripClick?: () => void;
  onPlanTrip?: () => void;
  onNavigate?: (sectionId: string) => void;
  onOpenSidebar?: () => void;
  onSelectDestination?: (destId: string) => void;
  onOpenMapsAgent?: (prompt?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onPlanTripClick,
  onPlanTrip,
  onNavigate,
  onOpenSidebar,
  onSelectDestination,
  onOpenMapsAgent,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { isDark, toggleTheme } = useTheme();
  const { totalSavedCount, openWishlist } = useWishlist();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handlePlanClick = () => {
    if (onPlanTripClick) {
      onPlanTripClick();
    } else if (onPlanTrip) {
      onPlanTrip();
    } else {
      navigate('/plan');
    }
  };

  const handleLogoClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const hero = document.getElementById('hero');
      if (hero) hero.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  const filteredDestinations = searchQuery.trim()
    ? DESTINATIONS.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleDestinationClick = (destId: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    if (onSelectDestination) {
      onSelectDestination(destId);
    } else {
      navigate('/destinations');
    }
  };

  return (
    <>
      {/* Floating Slim Luxury Navbar */}
      <header className="fixed top-2.5 sm:top-3.5 inset-x-0 mx-auto w-[96%] sm:w-[94%] max-w-6xl 2xl:max-w-7xl z-50 transition-all duration-300 pointer-events-auto">
        <div
          className="w-full h-12.5 sm:h-14 rounded-full transition-all duration-300 px-3 sm:px-4 md:px-5 flex items-center justify-between gap-2 sm:gap-3 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-2xl border border-neutral-200 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.8)] text-neutral-900 dark:text-white"
        >
          {/* Left: Compass Monogram & Branding */}
          <div className="flex items-center shrink-0">
            <Link
              to="/"
              onClick={handleLogoClick}
              className="flex items-center gap-1.5 sm:gap-2 group focus:outline-none cursor-pointer py-1.5 px-0.5 sm:px-1 -my-1.5 touch-manipulation select-none active:opacity-85"
              aria-label="My Kind of Travel Home"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E37500] text-white flex items-center justify-center group-hover:scale-105 transition-all shadow-xs shrink-0">
                <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] transition-transform duration-300 group-hover:rotate-45" />
              </div>
              <div className="flex items-baseline gap-1.5 min-w-0">
                <span className="font-serif text-[13px] xs:text-sm sm:text-base font-bold tracking-tight text-[#E37500] group-hover:text-[#C66500] transition-colors leading-none truncate max-w-[125px] xs:max-w-[160px] sm:max-w-none">
                  My Kind of Travel
                </span>
                <span className="hidden md:inline text-[9px] uppercase tracking-widest text-[#E37500]/70 dark:text-[#E37500]/80 font-semibold shrink-0">
                  · Bespoke
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Sleek Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1.5 2xl:space-x-2 text-[11.5px] xl:text-[13px] font-medium text-neutral-700 dark:text-neutral-200">
            {/* DESTINATIONS Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('destinations')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleNavClick('destinations')}
                className="px-2.5 py-1 rounded-lg hover:text-[#E37500] dark:hover:text-[#E37500] transition-colors flex items-center gap-1 group"
              >
                <span>Destinations</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'destinations' ? 'rotate-180 text-[#E37500]' : scrolled ? 'text-neutral-500' : 'text-white/70'}`} />
              </button>

              {activeDropdown === 'destinations' && (
                <div className="absolute top-full left-0 pt-2 w-60 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white dark:bg-[#0E0E0E] border border-neutral-200 dark:border-white/10 rounded-2xl shadow-xl p-2 backdrop-blur-2xl text-left">
                    <div className="px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest text-[#E37500]">
                      Curated Destinations
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {DESTINATIONS.slice(0, 7).map((dest) => (
                        <button
                          key={dest.id}
                          onClick={() => handleDestinationClick(dest.id)}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs text-neutral-900 dark:text-white hover:bg-[#E37500]/10 hover:text-[#E37500] transition-colors flex items-center justify-between group/item"
                        >
                          <span>{dest.name}</span>
                          <ArrowRight className="w-3 h-3 text-[#E37500] opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          handleNavClick('destinations');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#E37500] hover:bg-[#E37500]/15 transition-colors border-t border-neutral-200 dark:border-white/10 mt-1 flex items-center justify-between"
                      >
                        <span>View All Destinations</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PACKAGES */}
            <button
              onClick={() => handleNavClick('packages')}
              className="px-2.5 py-1 rounded-lg hover:text-[#E37500] dark:hover:text-[#E37500] transition-colors"
            >
              Packages
            </button>

            {/* EXPERIENCES Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('experiences')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleNavClick('experiences')}
                className="px-2.5 py-1 rounded-lg hover:text-[#E37500] dark:hover:text-[#E37500] transition-colors flex items-center gap-1 group"
              >
                <span>Experiences</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'experiences' ? 'rotate-180 text-[#E37500]' : scrolled ? 'text-neutral-500' : 'text-white/70'}`} />
              </button>

              {activeDropdown === 'experiences' && (
                <div className="absolute top-full left-0 pt-2 w-56 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white dark:bg-[#0E0E0E] border border-neutral-200 dark:border-white/10 rounded-2xl shadow-xl p-2 backdrop-blur-2xl text-left">
                    <div className="px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest text-[#E37500]">
                      Holiday Pillars
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {[
                        'Private Pool Villas',
                        'Alpine & Glacial Rail',
                        'Honeymoon Caldera Suites',
                        'Michelin & Wine Tastings',
                        'Island Overwater Bungalows',
                        'Zen Ryokans & Onsens',
                      ].map((exp, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setActiveDropdown(null);
                            handleNavClick('experiences');
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs text-neutral-900 dark:text-white hover:bg-[#E37500]/10 hover:text-[#E37500] transition-colors"
                        >
                          {exp}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          navigate('/experiences');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#E37500] hover:bg-[#E37500]/15 transition-colors border-t border-neutral-200 dark:border-white/10 mt-1 flex items-center justify-between"
                      >
                        <span>View All Experiences</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>



            {/* PLACES */}
            <button
              onClick={() => navigate('/places')}
              className="px-2.5 py-1 rounded-lg hover:text-[#E37500] dark:hover:text-[#E37500] transition-colors"
            >
              Places
            </button>

            {/* MOMENTS */}
            <button
              onClick={() => handleNavClick('gallery')}
              className="px-2.5 py-1 rounded-lg hover:text-[#E37500] dark:hover:text-[#E37500] transition-colors"
            >
              Moments
            </button>

            {/* CONTACT */}
            <button
              onClick={() => handleNavClick('contact')}
              className="px-2.5 py-1 rounded-lg hover:text-[#E37500] dark:hover:text-[#E37500] transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Right: Quick Utilities & Plan Trip CTA */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-neutral-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer touch-manipulation active:scale-90"
              title="Search destinations"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
            </button>

            {/* Wishlist */}
            <button
              onClick={openWishlist}
              className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-neutral-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer touch-manipulation active:scale-90"
              title="Saved Journeys"
              aria-label="Wishlist"
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] ${totalSavedCount > 0 ? 'fill-[#E37500] text-[#E37500]' : ''}`} />
              {totalSavedCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#E37500] text-white text-[8px] font-bold flex items-center justify-center shadow-xs">
                  {totalSavedCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-neutral-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer touch-manipulation active:scale-90"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 text-[#E37500]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-neutral-700" />
              )}
            </button>

            {/* Refined Plan Trip CTA */}
            <button
              onClick={handlePlanClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E37500] hover:bg-[#C66500] active:scale-95 text-white font-semibold text-[11px] uppercase tracking-wider transition-all shadow-xs shrink-0 cursor-pointer touch-manipulation"
            >
              <span>Plan Trip</span>
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center text-neutral-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all ml-0.5 cursor-pointer touch-manipulation active:scale-90"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Live Search Floating Card Dropdown */}
        {searchOpen && (
          <div className="mt-2 w-full max-w-xl mx-auto bg-white dark:bg-[#0E0E0E] border border-neutral-200 dark:border-white/10 rounded-2xl p-3 shadow-xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Bali, Switzerland, Paris, Maldives, Santorini..."
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-white dark:bg-white/10 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:ring-1 focus:ring-[#E37500] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Results Preview */}
            {searchQuery.trim() && (
              <div className="max-h-60 overflow-y-auto space-y-1 pt-2">
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => handleDestinationClick(dest.id)}
                      className="w-full p-2 rounded-xl hover:bg-[#E37500]/10 text-left flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-3.5 h-3.5 text-[#E37500]" />
                        <div>
                          <span className="font-semibold text-neutral-900 dark:text-white text-xs block">
                            {dest.name}
                          </span>
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                            {dest.region} · {dest.priceNote}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:text-[#E37500] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-neutral-500 text-center py-3">
                    No destinations matching "{searchQuery}". Try "Bali", "Switzerland", or "Santorini".
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile & Tablet Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 w-full bg-white dark:bg-[#0E0E0E] border border-neutral-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-2xl space-y-3 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs font-semibold">
              <button
                onClick={() => handleNavClick('hero')}
                className="text-left text-[#E37500] py-2 px-3 rounded-xl hover:bg-[#E37500]/10 cursor-pointer"
              >
                Home
              </button>

              <button
                onClick={() => handleNavClick('destinations')}
                className="text-left text-neutral-900 dark:text-white py-2 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                Destinations
              </button>

              <button
                onClick={() => handleNavClick('packages')}
                className="text-left text-neutral-900 dark:text-white py-2 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                Packages
              </button>

              <button
                onClick={() => handleNavClick('experiences')}
                className="text-left text-neutral-900 dark:text-white py-2 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                Experiences
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/places');
                }}
                className="text-left text-neutral-900 dark:text-white py-2 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                Places & Views
              </button>

              <button
                onClick={() => handleNavClick('gallery')}
                className="text-left text-neutral-900 dark:text-white py-2 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                Moments
              </button>

              <button
                onClick={() => handleNavClick('contact')}
                className="text-left text-neutral-900 dark:text-white py-2 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer sm:col-span-2"
              >
                Contact
              </button>
            </div>

            <div className="pt-2 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between gap-2">
              {onOpenSidebar && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSidebar();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white text-xs font-semibold flex-1 text-center cursor-pointer"
                >
                  Menu Drawer
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handlePlanClick();
                }}
                className="px-4 py-2 rounded-xl bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-semibold flex-1 text-center shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                Plan Trip
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
