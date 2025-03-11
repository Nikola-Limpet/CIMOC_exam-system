import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ExamSearchFilterProps {
  searchQuery: string;
  view: 'grid' | 'list';
  isSearching: boolean;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onViewChange: (view: 'grid' | 'list') => void;
}

export function ExamSearchFilter({
  searchQuery,
  view,
  isSearching,
  onSearchChange,
  onViewChange,
}: ExamSearchFilterProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search exams by title or description..."
          className="pl-8"
          value={searchQuery}
          onChange={onSearchChange}
          disabled={isSearching}
        />
        {isSearching && (
          <div className="absolute right-2.5 top-2.5">
            <svg
              className="animate-spin h-4 w-4 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant={view === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewChange('grid')}
          className="px-3"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" className="h-4 w-4">
            <path
              d="M1.5 1.5h4v4h-4v-4zm8 0h4v4h-4v-4zm-8 8h4v4h-4v-4zm8 0h4v4h-4v-4z"
              fill="currentColor"
            />
          </svg>
          <span className="ml-1">Grid</span>
        </Button>
        <Button
          variant={view === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewChange('list')}
          className="px-3"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" className="h-4 w-4">
            <path d="M1.5 1.5h12v2h-12v-2zm0 5h12v2h-12v-2zm0 5h12v2h-12v-2z" fill="currentColor" />
          </svg>
          <span className="ml-1">List</span>
        </Button>
      </div>
    </div>
  );
}
