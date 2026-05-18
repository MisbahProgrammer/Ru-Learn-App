import React, { useState, useEffect } from 'react';
import { useAuth } from '@/App';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  PlayCircle, 
  Lock, 
  Youtube, 
  GraduationCap, 
  Video,
  Clock,
  ExternalLink,
  ChevronRight,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Lecture {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  type: 'youtube' | 'premium';
  category: string;
  createdAt?: any;
}

export function LecturesView() {
  const { isPremium, user } = useAuth();
  const [lectures, setLectures] = React.useState<Lecture[]>([]);
  const [activeVideo, setActiveVideo] = useState<Lecture | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  // ADMIN CHECK: Hardcoded for your email
  const isAdmin = user?.email === 'misbahrehman891@gmail.com';

  useEffect(() => {
    const q = query(collection(db, 'lectures'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lecture[];
      setLectures(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddLecture = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await addDoc(collection(db, 'lectures'), {
        title: formData.get('title'),
        description: formData.get('description'),
        duration: formData.get('duration'),
        thumbnail: formData.get('thumbnail') || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800',
        videoUrl: formData.get('videoUrl'),
        type: formData.get('type'),
        category: formData.get('category'),
        createdAt: serverTimestamp(),
      });
      toast.success('Lecture added successfully!');
      setIsAdding(false);
    } catch (error: any) {
      toast.error('Error adding lecture: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lecture?')) return;
    try {
      await deleteDoc(doc(db, 'lectures', id));
      toast.success('Lecture deleted');
    } catch (error: any) {
      toast.error('Error deleting: ' + error.message);
    }
  };

  const handlePlay = (lecture: Lecture) => {
    if (lecture.type === 'premium' && !isPremium && !isAdmin) {
      return; 
    }
    setActiveVideo(lecture);
  };

  return (
    <div className="h-full bg-neutral-50/30">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-8 pb-32 md:pb-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-4xl font-light tracking-tight mb-2">Video <span className="font-serif italic font-medium text-orange-600">Library</span></h2>
                <p className="text-neutral-500 font-light max-w-2xl leading-relaxed">
                  Access a curated collection of lessons, including public tutorials and exclusive intensive recordings from <span className="font-medium text-neutral-900 underline decoration-orange-200">RUDN University</span>.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Dialog open={isAdding} onOpenChange={setIsAdding}>
                    <DialogTrigger 
                      render={
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl gap-2">
                          <Plus className="w-4 h-4" /> Add Lecture
                        </Button>
                      }
                    />
                    <DialogContent className="sm:max-w-[425px] rounded-3xl">
                      <DialogHeader>
                        <DialogTitle>Add New Lesson</DialogTitle>
                        <DialogDescription>
                          Enter the details for the new video lesson. Use unlisted YouTube or Drive links.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddLecture} className="space-y-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Title</Label>
                          <Input id="title" name="title" placeholder="e.g. Basic Russian Phonics" required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="videoUrl">Video URL (Embed Link)</Label>
                          <Input id="videoUrl" name="videoUrl" placeholder="https://www.youtube.com/embed/..." required />
                          <p className="text-[10px] text-neutral-400">Use embed version of the link for it to work inside the app.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="duration">Duration</Label>
                            <Input id="duration" name="duration" placeholder="e.g. 15:20" required />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="type">Plan Type</Label>
                            <Select name="type" defaultValue="premium">
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="youtube">Free (YouTube)</SelectItem>
                                <SelectItem value="premium">Premium (RUDN)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="category">Category</Label>
                          <Input id="category" name="category" placeholder="e.g. University Course" required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="thumbnail">Thumbnail Image URL (Optional)</Label>
                          <Input id="thumbnail" name="thumbnail" placeholder="https://..." />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea id="description" name="description" placeholder="Brief overview of the lesson..." required />
                        </div>
                        <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">Save Lesson</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
                <Badge variant="outline" className="bg-white border-neutral-200 py-1">
                  {lectures.length} Lessons
                </Badge>
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                 <div className="w-8 h-8 border-4 border-orange-600/20 border-t-orange-600 rounded-full animate-spin mx-auto mb-4" />
                 <p className="text-neutral-500">Loading your library...</p>
              </div>
            ) : activeVideo ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={activeVideo.videoUrl} 
                    title={activeVideo.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-3xl shadow-sm border border-neutral-100">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={activeVideo.type === 'premium' ? 'bg-orange-500' : 'bg-blue-500'}>
                        {activeVideo.type.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium text-neutral-400">{activeVideo.category}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{activeVideo.title}</h3>
                    <p className="text-neutral-500 leading-relaxed">{activeVideo.description}</p>
                  </div>
                  <div className="shrink-0 flex flex-col justify-center">
                    <Button variant="outline" onClick={() => setActiveVideo(null)} className="rounded-xl">
                      Close Video
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lectures.map((lecture) => {
                  const isLocked = lecture.type === 'premium' && !isPremium && !isAdmin;
                  
                  return (
                    <Card key={lecture.id} className="group overflow-hidden rounded-3xl border-neutral-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="relative aspect-video">
                        <img 
                          src={lecture.thumbnail} 
                          alt={lecture.title} 
                          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isLocked ? 'grayscale opacity-60' : ''}`}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        
                        <div className="absolute top-3 left-3 flex gap-2">
                            {lecture.type === 'youtube' ? (
                                <Badge className="bg-red-600/90 text-white gap-1 backdrop-blur-sm border-none">
                                    <Youtube className="w-3 h-3" /> YouTube
                                </Badge>
                            ) : (
                                <Badge className="bg-orange-500/90 text-white gap-1 backdrop-blur-sm border-none">
                                    <GraduationCap className="w-3 h-3" /> RUDN Class
                                </Badge>
                            )}
                            {isAdmin && (
                              <Badge 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(lecture.id);
                                }}
                                className="bg-red-500/80 hover:bg-red-600 text-white cursor-pointer backdrop-blur-sm border-none"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Badge>
                            )}
                        </div>

                        {isLocked ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/60 backdrop-blur-md p-4 rounded-full">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handlePlay(lecture)}
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-xl">
                                <PlayCircle className="w-8 h-8 text-orange-600" />
                            </div>
                          </button>
                        )}
                        
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] h-5 px-2 flex items-center rounded-full backdrop-blur-sm font-bold">
                          <Clock className="w-3 h-3 mr-1" /> {lecture.duration}
                        </div>
                      </div>
                      
                      <CardContent className="p-5">
                          <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">{lecture.category}</div>
                          <h4 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">{lecture.title}</h4>
                          <p className="text-xs text-neutral-500 line-clamp-2 mb-4 h-8 leading-relaxed">
                             {lecture.description}
                          </p>
                          
                          {isLocked ? (
                                <Button className="w-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 rounded-xl" variant="secondary">
                                    <Crown className="w-4 h-4 mr-2" /> Upgrade to Watch
                                </Button>
                          ) : (
                                <Button 
                                    onClick={() => handlePlay(lecture)}
                                    className="w-full bg-white border-neutral-200 text-neutral-900 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 rounded-xl" 
                                    variant="outline"
                                >
                                    Watch Lesson <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                          )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
            
            {lectures.length === 0 && !loading && (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-neutral-100">
                <Video className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-neutral-400">Your video library is empty</h3>
                <p className="text-neutral-400 max-w-xs mx-auto mt-2">
                  {isAdmin ? 'Start by adding your first unlisted lecture link.' : 'New lectures are coming soon!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

const Crown = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
    </svg>
);
