import { useState, useEffect } from 'react';
import Maps from './Maps';
import { ChevronDown, MapPin, Clock, Phone } from 'lucide-react';

const OurStores = () => {
    // State management
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [activeLocation, setActiveLocation] = useState(null);
    const [animateMap, setAnimateMap] = useState(false);
    const [animateForm, setAnimateForm] = useState(false);

    // Store locations data
    const storeLocations = [
        {
            id: 1,
            name: "Downtown Flagship Store",
            address: "123 Main Street, Downtown, City",
            phone: "(555) 123-4567",
            hours: {
                monFri: "9:00 AM - 9:00 PM",
                sat: "10:00 AM - 8:00 PM",
                sun: "11:00 AM - 6:00 PM"
            },
            description: "Our flagship location featuring our full product line and exclusive in-store events."
        },
        {
            id: 2,
            name: "Westside Shopping Center",
            address: "456 Westway Mall, Westside, City",
            phone: "(555) 987-6543",
            hours: {
                monFri: "10:00 AM - 9:00 PM",
                sat: "10:00 AM - 8:00 PM",
                sun: "12:00 PM - 6:00 PM"
            },
            description: "Conveniently located in the Westside Shopping Center with easy parking access."
        },
        {
            id: 3,
            name: "Eastside Boutique",
            address: "789 East Avenue, Eastside, City",
            phone: "(555) 456-7890",
            hours: {
                monFri: "9:00 AM - 7:00 PM",
                sat: "10:00 AM - 6:00 PM",
                sun: "Closed"
            },
            description: "Our boutique location with personalized shopping experiences and custom services."
        }
    ];

    // Form handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);
        setSubmitted(true);
    };

    const toggleLocation = (id) => {
        setActiveLocation(activeLocation === id ? null : id);
    };

    // Animation effects when component mounts
    useEffect(() => {
        setAnimateMap(true);
        setTimeout(() => {
            setAnimateForm(true);
        }, 300);
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-8" style={{ backgroundColor: '#C5C7CA', color: '#181A1B' }}>
            <h1 className="text-4xl font-bold text-center mb-8 transition duration-700 transform hover:scale-105" 
                style={{ color: '#45423D', letterSpacing: '1px' }}>
                Our Boutique Locations
            </h1>
            
            <div className={`grid md:grid-cols-2 gap-8 mb-12 ${animateMap ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`}>
                {/* Map Section */}
                <div className="rounded-lg overflow-hidden transition duration-500 transform hover:shadow-xl" 
                     style={{ backgroundColor: '#C5C7CA', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                    <div className="p-6 border-b" style={{ borderColor: '#6C6A61' }}>
                        <h2 className="text-2xl font-semibold mb-4" style={{ color: '#45423D', letterSpacing: '0.5px' }}>Discover Our Boutiques</h2>
                        <p style={{ color: '#181A1B', opacity: '0.9' }} className="mb-4">Visit any of our exclusive locations. Select a boutique below for more details.</p>
                    </div>
                    <div className="h-96 w-full transition duration-500 transform hover:scale-[1.02]">
                        <Maps />
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className={`rounded-lg p-6 ${animateForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700 delay-300`}
                     style={{ backgroundColor: '#C5C7CA', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                    <h2 className="text-2xl font-semibold mb-4" style={{ color: '#45423D', letterSpacing: '0.5px' }}>Contact Us</h2>
                    <p className="mb-6" style={{ color: '#181A1B', opacity: '0.9' }}>Have inquiries about our boutiques? Send us a message and our concierge will respond promptly.</p>
                    
                    {submitted ? (
                        <div className="border rounded-md p-4 mb-6 animate-pulse"
                             style={{ backgroundColor: 'rgba(69, 66, 61, 0.1)', borderColor: '#6C6A61' }}>
                            <p className="font-medium" style={{ color: '#45423D' }}>Thank you for your message.</p>
                            <p style={{ color: '#181A1B', opacity: '0.9' }}>Our team will respond to you shortly.</p>
                        </div>
                    ) : null}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: '#45423D' }}>Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="block w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none transition duration-300"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderColor: '#6C6A61', color: '#181A1B' }}
                                placeholder="Your name"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: '#45423D' }}>Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="block w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none transition duration-300"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderColor: '#6C6A61', color: '#181A1B' }}
                                placeholder="your.email@example.com"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium mb-1" style={{ color: '#45423D' }}>Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="block w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none transition duration-300"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderColor: '#6C6A61', color: '#181A1B' }}
                                placeholder="How can we assist you?"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full px-6 py-3 font-medium rounded-md shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                            style={{ 
                                backgroundColor: '#6C6A61', 
                                color: '#C5C7CA',
                                letterSpacing: '0.5px',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                            }}
                        >
                            {submitted ? 'Message Sent' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Store Locations Dropdown Section - Cleaner, Lighter Design */}
            <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#C5C7CA', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                <h2 className="text-2xl font-semibold p-6 border-b" 
                    style={{ color: '#45423D', borderColor: '#6C6A61', letterSpacing: '0.5px' }}>
                    Our Exclusive Boutiques
                </h2>
                
                <div>
                    {storeLocations.map((location, index) => (
                        <div key={location.id} className="transition-all duration-300">
                            <div 
                                className="p-6 flex justify-between items-center cursor-pointer hover:bg-opacity-80 transition-all"
                                onClick={() => toggleLocation(location.id)}
                                style={{ 
                                    backgroundColor: activeLocation === location.id ? 'rgba(108, 106, 97, 0.15)' : 'transparent',
                                    borderBottom: index !== storeLocations.length - 1 ? '1px solid rgba(108, 106, 97, 0.3)' : 'none'
                                }}
                            >
                                <div className="flex items-center">
                                    <MapPin style={{ color: '#45423D' }} className="mr-3" size={20} />
                                    <h3 className="text-lg font-medium" style={{ color: '#181A1B', letterSpacing: '0.3px' }}>{location.name}</h3>
                                </div>
                                <div className="bg-white bg-opacity-50 rounded-full p-1 transition-all duration-300"
                                     style={{ 
                                         transform: activeLocation === location.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                         boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                     }}>
                                    <ChevronDown style={{ color: '#45423D' }} size={18} />
                                </div>
                            </div>
                            
                            <div 
                                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                    activeLocation === location.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                            >
                                <div className="p-6 grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <p style={{ color: '#181A1B', lineHeight: '1.6' }}>{location.description}</p>
                                        
                                        <div className="flex items-start">
                                            <MapPin style={{ color: '#45423D' }} className="mr-2 mt-1 flex-shrink-0" size={16} />
                                            <span style={{ color: '#181A1B' }}>{location.address}</span>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <Phone style={{ color: '#45423D' }} className="mr-2 mt-1 flex-shrink-0" size={16} />
                                            <span style={{ color: '#181A1B' }}>{location.phone}</span>
                                        </div>
                                        
                                        <button 
                                            className="mt-2 inline-flex items-center px-5 py-2 text-sm font-medium rounded-md transition duration-300"
                                            style={{ 
                                                backgroundColor: '#6C6A61', 
                                                color: '#C5C7CA',
                                                letterSpacing: '0.3px',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            Get Directions
                                        </button>
                                    </div>
                                    
                                    <div className="bg-white bg-opacity-70 p-4 rounded-lg shadow-sm">
                                        <h4 className="text-md font-medium mb-3" style={{ color: '#45423D', letterSpacing: '0.3px' }}>
                                            <Clock style={{ color: '#45423D', display: 'inline' }} className="mr-2" size={16} />
                                            Boutique Hours
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid rgba(108, 106, 97, 0.2)' }}>
                                                <span style={{ color: '#181A1B', fontWeight: '500' }}>Monday - Friday</span>
                                                <span style={{ color: '#45423D' }}>{location.hours.monFri}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid rgba(108, 106, 97, 0.2)' }}>
                                                <span style={{ color: '#181A1B', fontWeight: '500' }}>Saturday</span>
                                                <span style={{ color: '#45423D' }}>{location.hours.sat}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span style={{ color: '#181A1B', fontWeight: '500' }}>Sunday</span>
                                                <span style={{ color: '#45423D' }}>{location.hours.sun}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OurStores;



