import React, { useState, useMemo } from 'react';
import { EnrichedPlace } from '../types';
import { Plus, Search, Trash2, Edit2, MapPin, Eye, Check, X, Sparkles, Image as ImageIcon, Camera } from 'lucide-react';
import { GlassImage } from '../components/GlassImage';
import { ImageUploadField } from './ImageUploadField';

interface PlacesManagerProps {
  places: EnrichedPlace[];
  onUpdatePlaces: (places: EnrichedPlace[]) => void;
}

export const PlacesManager: React.FC<PlacesManagerProps> = ({ places, onUpdatePlaces }) => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [editingPlace, setEditingPlace] = useState<EnrichedPlace | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [quickImagePlaceId, setQuickImagePlaceId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<EnrichedPlace>>({
    title: '',
    propertySubtitle: '',
    location: '',
    country: '',
    region: 'Europe',
    category: 'Stays',
    theme: 'alpine',
    image: '',
    caption: '',
    highlights: [],
    bestSeason: '',
    idealStay: '',
    transferNote: '',
    startingPriceNote: '',
    curatorNote: '',
    isFeatured: false,
  });

  const [highlightInput, setHighlightInput] = useState('');

  const regions = ['All', 'Europe', 'Southeast Asia', 'Indian Ocean', 'East Asia', 'Middle East'];

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.propertySubtitle.toLowerCase().includes(q);

      const matchesRegion = selectedRegion === 'All' || p.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [places, search, selectedRegion]);

  const handleOpenCreate = () => {
    setFormData({
      id: `place-${Date.now()}`,
      title: '',
      propertySubtitle: '',
      location: '',
      country: '',
      region: 'Europe',
      category: 'Stays',
      theme: 'coastal',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
      caption: '',
      highlights: ['Private Balcony', 'Chauffeur Transfer'],
      bestSeason: 'May to October',
      idealStay: '3 to 5 Nights',
      transferNote: 'Private chauffeur transfer',
      startingPriceNote: 'Starting from ₹1,20,000 / Night',
      curatorNote: 'Hand-picked by our luxury travel directors.',
      isFeatured: false,
    });
    setHighlightInput('');
    setIsCreating(true);
    setEditingPlace(null);
  };

  const handleOpenEdit = (place: EnrichedPlace) => {
    setEditingPlace(place);
    setFormData({ ...place });
    setHighlightInput('');
    setIsCreating(false);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.image) {
      alert('Please fill out at least the Title, Location, and Image URL.');
      return;
    }

    if (isCreating) {
      const newPlace = {
        ...formData,
        id: formData.id || `place-${Date.now()}`,
        highlights: formData.highlights || [],
      } as EnrichedPlace;
      onUpdatePlaces([newPlace, ...places]);
    } else if (editingPlace) {
      const updated = places.map((p) => (p.id === editingPlace.id ? ({ ...formData } as EnrichedPlace) : p));
      onUpdatePlaces(updated);
    }

    setIsCreating(false);
    setEditingPlace(null);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}"?`)) {
      onUpdatePlaces(places.filter((p) => p.id !== id));
    }
  };

  const handleAddHighlight = () => {
    const trimmed = highlightInput.trim();
    if (trimmed) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...(prev.highlights || []), trimmed],
      }));
      setHighlightInput('');
    }
  };

  const handleRemoveHighlight = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#141414] border border-[#262626]">
        <div>
          <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
            <span>Curated Sanctuaries & Places Catalog</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E37500]/20 text-[#E37500] font-sans font-bold">
              {places.length} Total
            </span>
          </h2>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            Manage villas, overwater reserves, chalets, and scenic excursions displayed on the live /places catalog.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#E37500] hover:bg-[#C66500] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Sanctuary</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#141414] border border-[#262626]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sanctuaries by name, country, or resort..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1D1D1D] border border-[#262626] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E37500]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mr-1">Region:</span>
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedRegion === r
                  ? 'bg-[#E37500] text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-[#1D1D1D]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Places Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPlaces.map((place) => (
          <div
            key={place.id}
            className="rounded-2xl bg-[#141414] border border-[#262626] overflow-hidden flex flex-col justify-between group hover:border-[#E37500]/40 transition-all"
          >
            <div>
              {/* Image Preview */}
              <div className="relative h-40 w-full overflow-hidden bg-neutral-900">
                <img
                  src={place.image}
                  alt={place.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
                    {place.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E37500]/90 text-[10px] font-bold text-white">
                    {place.region}
                  </span>
                </div>

                {/* Quick Image Update Overlay Button */}
                <button
                  type="button"
                  onClick={() => setQuickImagePlaceId(place.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 hover:bg-[#E37500] backdrop-blur-md text-[11px] font-semibold text-white flex items-center gap-1.5 shadow-md cursor-pointer border border-white/10"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change Image</span>
                </button>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-[#E37500] font-semibold truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{place.location}</span>
                </div>
                <h4 className="font-serif text-sm font-bold text-white line-clamp-1">{place.title}</h4>
                <p className="text-[11px] text-neutral-400 line-clamp-2">{place.caption}</p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-300 font-semibold border-t border-[#262626]">
                  <span>{place.startingPriceNote}</span>
                  <span className="text-neutral-500">{place.idealStay}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 bg-[#111111] border-t border-[#262626] flex items-center justify-end gap-2">
              <button
                onClick={() => setQuickImagePlaceId(place.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E1E1E] hover:bg-[#2A2A2A] text-neutral-300 hover:text-white text-xs font-semibold transition-all"
                title="Quick Change Cover Photo"
              >
                <Camera className="w-3.5 h-3.5 text-[#E37500]" />
                <span className="hidden sm:inline">Image</span>
              </button>
              <button
                onClick={() => handleOpenEdit(place)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E1E1E] hover:bg-[#2A2A2A] text-white text-xs font-semibold transition-all"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#E37500]" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(place.id, place.title)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 text-xs font-semibold transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPlaces.length === 0 && (
        <div className="text-center py-12 rounded-2xl bg-[#141414] border border-[#262626] text-neutral-400 text-xs space-y-2">
          <p className="font-semibold text-white">No curated sanctuaries match your search.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedRegion('All');
            }}
            className="text-[#E37500] underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Edit / Create Modal Form */}
      {(isCreating || editingPlace) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121212] border border-[#262626] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
              <div>
                <h3 className="font-serif text-lg font-bold">
                  {isCreating ? 'Add New Curated Sanctuary' : `Edit "${editingPlace?.title}"`}
                </h3>
                <span className="text-xs text-neutral-400">
                  Changes will sync to the live /places catalog upon clicking Publish Changes.
                </span>
              </div>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingPlace(null);
                }}
                className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Overwater Lagoon Reserve with Ocean Slide"
                    className="w-full px-3 py-2 rounded-xl bg-[#1E1E1E] border border-[#262626] text-xs text-white focus:outline-none focus:border-[#E37500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">Property Subtitle</label>
                  <input
                    type="text"
                    value={formData.propertySubtitle || ''}
                    onChange={(e) => setFormData({ ...formData, propertySubtitle: e.target.value })}
                    placeholder="e.g. Soneva Jani, Medhufaru Island"
                    className="w-full px-3 py-2 rounded-xl bg-[#1E1E1E] border border-[#262626] text-xs text-white focus:outline-none focus:border-[#E37500]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Noonu Atoll, Maldives"
                    className="w-full px-3 py-2 rounded-xl bg-[#1E1E1E] border border-[#262626] text-xs text-white focus:outline-none focus:border-[#E37500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={formData.country || ''}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. Maldives"
                    className="w-full px-3 py-2 rounded-xl bg-[#1E1E1E] border border-[#262626] text-xs text-white focus:outline-none focus:border-[#E37500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">Region</label>
                  <select
                    value={formData.region || 'Europe'}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1E1E1E] border border-[#262626] text-xs text-white focus:outline-none focus:border-[#E37500]"
                  >
                    <option value="Europe">Europe</option>
                    <option value="Southeast Asia">Southeast Asia</option>
                    <option value="Indian Ocean">Indian Ocean</option>
                    <option value="East Asia">East Asia</option>
                    <option value="Middle East">Middle East</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">Category</label>
                  <select
                    value={formData.category || 'Stays'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1E1E1E] border border-[#262626] text-xs text-white focus:outline-none focus:border-[#E37500]"
                  >
                    <option value="Stays">Stays</option>
                    <option value="Journeys">Journeys</option>
                    <option value="Moments">Moments</option>
                    <option value="Gourmet">Gourmet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">Collection Theme</label>
                  <select
                    value={formData.theme || 'coastal'}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1E1E1E] border border-[#262626] text-xs text-white focus:outline-none focus:border-[#E37500]"
                  >
                    <option value="overwater">Overwater & Lagoons</option>
                    <option value="alpine">Alpine & Snow Sanctuaries</option>
                    <option value="coastal">Mediterranean & Coastal</option>
                    <option value="heritage">Historic & Royal Estates</option>
                    <option value="gourmet">Gourmet & Dining</option>
                  </select>
                </div>
              </div>

              <div>
                <ImageUploadField
                  label="Sanctuary Primary Cover Image *"
                  value={formData.image || ''}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  aspectRatio="video"
                  helperText="Choose from curated luxury presets or upload high-resolution sanctuary photography."
                />
              </div>

              {/* Secondary Gallery Images */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-neutral-400">
                    Additional Gallery Images ({(formData.additionalImages || []).length})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = formData.additionalImages || [];
                      setFormData({ ...formData, additionalImages: [...cur, ''] });
                    }}
                    className="text-[11px] text-[#E37500] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Image Slot
                  </button>
                </div>
                {(formData.additionalImages || []).length > 0 && (
                  <div className="space-y-2">
                    {(formData.additionalImages || []).map((imgUrl, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={imgUrl}
                          onChange={(e) => {
                            const cur = [...(formData.additionalImages || [])];
                            cur[i] = e.target.value;
                            setFormData({ ...formData, additionalImages: cur });
                          }}
                          placeholder="Secondary image URL (https://...)"
                          className="flex-1 px-3 py-1.5 rounded-lg bg-[#1E1E1E] border border-[#262626] text-xs text-white outline-none focus:border-[#E37500]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const cur = (formData.additionalImages || []).filter((_, idx) => idx !== i);
                            setFormData({ ...formData, additionalImages: cur });
                          }}
                          className="p-1.5 text-neutral-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">Description Caption</label>
                <textarea
                  rows={2}
                  value={formData.caption || ''}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Atmospheric summary of the stay or experience..."
                  className="w-full px-3 py-2 rounded-xl bg-[#1E1E1E] border border-[#262626] text-xs text-white focus:outline-none focus:border-[#E37500]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">Starting Price Note</label>
                  <input
                    type="text"
                    value={formData.startingPriceNote || ''}
                    onChange={(e) => setFormData({ ...formData, startingPriceNote: e.target.value })}
                    placeholder="e.g. Starting from ₹2,40,000 / Night"
                    className="w-full px-3 py-2 rounded-xl bg-[#1E1E1E] border border-[#262626] text-xs text-white focus:outline-none focus:border-[#E37500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">Ideal Stay</label>
                  <input
                    type="text"
                    value={formData.idealStay || ''}
                    onChange={(e) => setFormData({ ...formData, idealStay: e.target.value })}
                    placeholder="e.g. 5 to 7 Nights"
                    className="w-full px-3 py-2 rounded-xl bg-[#1E1E1E] border border-[#262626] text-xs text-white focus:outline-none focus:border-[#E37500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">Best Season</label>
                  <input
                    type="text"
                    value={formData.bestSeason || ''}
                    onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })}
                    placeholder="e.g. Nov to Apr"
                    className="w-full px-3 py-2 rounded-xl bg-[#1E1E1E] border border-[#262626] text-xs text-white focus:outline-none focus:border-[#E37500]"
                  />
                </div>
              </div>

              {/* Highlights Pill Editor */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">Signature Highlights</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                    placeholder="Type highlight and press Add..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#1E1E1E] border border-[#262626] text-xs text-white focus:outline-none focus:border-[#E37500]"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-3 py-1.5 rounded-xl bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(formData.highlights || []).map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1E1E1E] border border-[#262626] text-xs text-neutral-300"
                    >
                      <span>{h}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(i)}
                        className="text-neutral-500 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingPlace(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#1E1E1E] hover:bg-[#2A2A2A] text-xs font-semibold text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  {isCreating ? 'Create Sanctuary' : 'Update Sanctuary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Quick Image Changer Modal */}
      {quickImagePlaceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#E37500]" />
                <h3 className="text-sm font-bold text-white truncate max-w-xs">
                  Update Image: {places.find((p) => p.id === quickImagePlaceId)?.title}
                </h3>
              </div>
              <button
                onClick={() => setQuickImagePlaceId(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ImageUploadField
              label="Select or Upload New Cover Photo"
              value={places.find((p) => p.id === quickImagePlaceId)?.image || ''}
              onChange={(newUrl) => {
                onUpdatePlaces(
                  places.map((p) => (p.id === quickImagePlaceId ? { ...p, image: newUrl } : p))
                );
              }}
              aspectRatio="video"
              helperText="Updates the sanctuary card cover image immediately."
            />

            <div className="flex justify-end pt-2 border-t border-[#262626]">
              <button
                onClick={() => setQuickImagePlaceId(null)}
                className="px-5 py-2 bg-[#E37500] hover:bg-[#C66500] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Done Updating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
