import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card } from '../components/ui/card';
import userService from '../services/userService';
import { toast } from 'sonner';
import { Check, X, Edit, Trash2, Search, UserCheck, UserX, Users as UsersIcon, Mail, Briefcase, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Spinner } from '../components/ui/spinner';
import { Separator } from '../components/ui/separator';

const EditUserForm = ({ user, onSave, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    nome: user.nome,
    email: user.email,
    role: user.role,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome Completo</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Cargo</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professor">Professor</SelectItem>
            <SelectItem value="coordenacao">Coordenação</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Salvando...
            </>
          ) : (
            'Salvar'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

const UserCard = ({ user, onAprovar, onRejeitar, onEdit, onDelete }) => {
  const getStatusVariant = (status) => ({
    'aprovado': 'default',
    'pendente': 'secondary',
    'rejeitado': 'destructive'
  }[status] || 'outline');

  return (
    <Card className="p-6 hover:shadow-md transition-all">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg">{user.nome}</h3>
              <Badge variant={getStatusVariant(user.status)} className="capitalize">
                {user.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="break-all">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground capitalize">
              <Briefcase className="h-4 w-4" />
              <span>{user.role}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>{format(new Date(user.createdAt), 'dd/MM/yyyy')}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-wrap gap-2">
          {user.status === 'pendente' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAprovar(user._id)}
                className="flex-1 sm:flex-none"
              >
                <Check className="mr-2 h-4 w-4" />
                Aprovar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRejeitar(user._id)}
                className="flex-1 sm:flex-none"
              >
                <X className="mr-2 h-4 w-4" />
                Rejeitar
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(user)}
            className="flex-1 sm:flex-none"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(user._id)}
            className="flex-1 sm:flex-none text-red-600 hover:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Deletar
          </Button>
        </div>
      </div>
    </Card>
  );
};

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await userService.listar();
      setUsuarios(data);
    } catch (error) {
      toast.error('Erro ao carregar usuários', {
        description: error.response?.data?.mensagem || 'Tente novamente'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, id, successMsg, errorMsg) => {
    try {
      await action(id);
      toast.success(successMsg);
      carregarUsuarios();
    } catch (error) {
      toast.error(errorMsg, {
        description: error.response?.data?.mensagem || 'Tente novamente'
      });
    }
  };

  const handleAprovar = (id) => handleAction(userService.aprovar, id, 'Usuário aprovado!', 'Erro ao aprovar');
  const handleRejeitar = (id) => handleAction(userService.rejeitar, id, 'Usuário rejeitado!', 'Erro ao rejeitar');

  const handleDelete = (id) => {
    if (confirm('Deletar este usuário? A ação é irreversível.')) {
      handleAction(userService.deletar, id, 'Usuário deletado!', 'Erro ao deletar');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (formData) => {
    try {
      setSaving(true);
      await userService.atualizar(editingUser._id, formData);
      toast.success('Usuário atualizado!');
      setIsModalOpen(false);
      setEditingUser(null);
      carregarUsuarios();
    } catch (error) {
      toast.error('Erro ao atualizar usuário', {
        description: error.response?.data?.mensagem || 'Tente novamente'
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredUsuarios = usuarios.filter(user =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: usuarios.length,
    aprovado: usuarios.filter(u => u.status === 'aprovado').length,
    pendente: usuarios.filter(u => u.status === 'pendente').length,
    rejeitado: usuarios.filter(u => u.status === 'rejeitado').length,
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex h-96 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 animate-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Gestão de Usuários</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie usuários e controle acessos
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">{stats.total}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <UsersIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Aprovados</p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">{stats.aprovado}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">{stats.pendente}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                <UsersIcon className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Rejeitados</p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">{stats.rejeitado}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <UserX className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Users Grid - Responsivo */}
        {filteredUsuarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg">
            <UsersIcon className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">Nenhum usuário encontrado</h3>
            <p className="text-muted-foreground max-w-sm">
              {searchTerm 
                ? 'Tente ajustar sua busca'
                : 'Não há usuários cadastrados no momento'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsuarios.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onAprovar={handleAprovar}
                onRejeitar={handleRejeitar}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <EditUserForm
              user={editingUser}
              onSave={handleSaveEdit}
              onCancel={() => setIsModalOpen(false)}
              saving={saving}
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default UsuariosPage;