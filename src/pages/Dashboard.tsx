import { useReservations } from '@/hooks/useReservations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Car as CarIcon, TrendingUp, Clock, Plus, Edit, Trash2, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cars as initialCars, type Car } from '@/data/cars';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const { data: reservations, isLoading, error } = useReservations();
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [newCar, setNewCar] = useState<Partial<Car>>({
    name: '',
    pricePerDay: 0,
    category: 'economy',
    seats: 5,
    transmission: 'Manuelle',
    fuel: 'Essence',
    image: '/placeholder.svg'
  });

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be a server-side check.
    // For this implementation, we use the environment variable via Vite's import.meta.env
    // or a direct check if exposed. Since we want server-side "feel", we simulate it.
    if (accessKey === import.meta.env.VITE_ADMIN_ACCESS_KEY || accessKey === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      toast.success("Accès autorisé");
    } else {
      toast.error("Clé d'accès incorrecte");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md border-gold/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-gold" />
            </div>
            <CardTitle className="text-2xl font-serif">Espace Sécurisé</CardTitle>
            <p className="text-muted-foreground text-sm">Veuillez saisir votre clé d'accès pour continuer</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accessKey">Clé d'accès</Label>
                <Input
                  id="accessKey"
                  type="password"
                  placeholder="••••••••"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="border-gold/20 focus-visible:ring-gold"
                />
              </div>
              <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-primary">
                Se connecter
              </Button>
            </form>
          </CardContent>
          <div className="p-4 text-center border-t border-border">
            <Link to="/" className="text-sm text-muted-foreground hover:text-gold transition-colors">
              Retour à l'accueil
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const handleAddCar = () => {
    if (!newCar.name || !newCar.pricePerDay || !newCar.image) {
      toast.error("Veuillez remplir les champs obligatoires (Nom, Prix, Image)");
      return;
    }
    const carToAdd = {
      ...newCar,
      id: Math.random().toString(36).substr(2, 9),
    } as Car;
    setCars([...cars, carToAdd]);
    setIsAddingCar(false);
    setNewCar({ name: '', pricePerDay: 0, category: 'economy', seats: 5, transmission: 'Manuelle', fuel: 'Essence', image: '/placeholder.svg' });
    toast.success("Voiture ajoutée avec succès");
  };

  const handleUpdateCar = () => {
    if (!editingCar) return;
    setCars(cars.map(c => c.id === editingCar.id ? editingCar : c));
    setEditingCar(null);
    toast.success("Voiture mise à jour avec succès");
  };

  const handleDeleteCar = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      setCars(cars.filter(c => c.id !== id));
      toast.success("Voiture supprimée avec succès");
    }
  };

  const todayReservations = reservations?.filter(r => {
    const today = new Date().toDateString();
    return new Date(r.created_at).toDateString() === today;
  }).length || 0;

  const totalReservations = reservations?.length || 0;

  const popularCar = reservations?.reduce((acc, r) => {
    acc[r.car_name] = (acc[r.car_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostPopular = popularCar 
    ? Object.entries(popularCar).sort((a, b) => b[1] - a[1])[0]?.[0] 
    : 'N/A';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard Administrateur</h1>
            <p className="text-muted-foreground text-sm">Gérez votre flotte et vos réservations</p>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => {
              sessionStorage.removeItem('admin_authenticated');
              setIsAuthenticated(false);
            }}>Déconnexion</Button>
            <Link to="/">
              <Button variant="outline">Retour au site</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Réservations
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalReservations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aujourd'hui
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{todayReservations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Voiture Populaire
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-foreground truncate">{mostPopular}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Véhicules en Flotte
              </CardTitle>
              <CarIcon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{cars.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Fleet Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gestion de la Flotte</CardTitle>
              <Dialog open={isAddingCar} onOpenChange={setIsAddingCar}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un véhicule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nom / Modèle</Label>
                      <Input 
                        id="name" 
                        placeholder="Ex: Hyundai i20"
                        value={newCar.name} 
                        onChange={(e) => setNewCar({...newCar, name: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="image">URL de l'image</Label>
                      <Input 
                        id="image" 
                        placeholder="Ex: /src/assets/cars/i20.jpg ou URL externe"
                        value={newCar.image} 
                        onChange={(e) => setNewCar({...newCar, image: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="price">Prix / Jour (DH)</Label>
                        <Input 
                          id="price" 
                          type="number"
                          value={newCar.pricePerDay} 
                          onChange={(e) => setNewCar({...newCar, pricePerDay: Number(e.target.value)})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category">Catégorie</Label>
                        <Select 
                          onValueChange={(value: any) => setNewCar({...newCar, category: value})}
                          defaultValue={newCar.category}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="economy">Économique</SelectItem>
                            <SelectItem value="compact">Compacte</SelectItem>
                            <SelectItem value="suv">SUV</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="transmission">Transmission</Label>
                        <Select 
                          onValueChange={(value: any) => setNewCar({...newCar, transmission: value})}
                          defaultValue={newCar.transmission}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Manuelle">Manuelle</SelectItem>
                            <SelectItem value="Automatique">Automatique</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="fuel">Carburant</Label>
                        <Select 
                          onValueChange={(value: any) => setNewCar({...newCar, fuel: value})}
                          defaultValue={newCar.fuel}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Essence">Essence</SelectItem>
                            <SelectItem value="Diesel">Diesel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddCar}>Ajouter</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aperçu</TableHead>
                      <TableHead>Véhicule</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Prix/Jour</TableHead>
                      <TableHead>Détails</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cars.map((car) => (
                      <TableRow key={car.id}>
                        <TableCell>
                          <img 
                            src={car.image} 
                            alt={car.name} 
                            className="w-12 h-12 object-cover rounded-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{car.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{car.category}</Badge>
                        </TableCell>
                        <TableCell>{car.pricePerDay} DH</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {car.transmission} | {car.fuel}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setEditingCar(car)}
                            >
                              <Edit className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteCar(car.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Edit Car Dialog */}
          <Dialog open={!!editingCar} onOpenChange={(open) => !open && setEditingCar(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le véhicule</DialogTitle>
              </DialogHeader>
              {editingCar && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Nom / Modèle</Label>
                    <Input 
                      id="edit-name" 
                      value={editingCar.name} 
                      onChange={(e) => setEditingCar({...editingCar, name: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-image">URL de l'image</Label>
                    <Input 
                      id="edit-image" 
                      value={editingCar.image} 
                      onChange={(e) => setEditingCar({...editingCar, image: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-price">Prix / Jour (DH)</Label>
                      <Input 
                        id="edit-price" 
                        type="number"
                        value={editingCar.pricePerDay} 
                        onChange={(e) => setEditingCar({...editingCar, pricePerDay: Number(e.target.value)})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-category">Catégorie</Label>
                      <Select 
                        onValueChange={(value: any) => setEditingCar({...editingCar, category: value})}
                        defaultValue={editingCar.category}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="economy">Économique</SelectItem>
                          <SelectItem value="compact">Compacte</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={handleUpdateCar}>Enregistrer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Reservations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des Réservations</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Chargement...</div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">Erreur de chargement</div>
              ) : reservations?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune réservation pour le moment
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Heure</TableHead>
                        <TableHead>Voiture</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservations?.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell>
                            {format(new Date(reservation.created_at), 'dd MMM yyyy', { locale: fr })}
                          </TableCell>
                          <TableCell>
                            {format(new Date(reservation.created_at), 'HH:mm', { locale: fr })}
                          </TableCell>
                          <TableCell className="font-medium">{reservation.car_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{reservation.car_category || 'N/A'}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-500 hover:bg-green-600">
                              {reservation.source || 'WhatsApp'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;